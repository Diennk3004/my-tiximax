import { AxiosService } from "@/utils";
import { Table, type TableProps, Card, type GetProp } from "antd";
import clsx from "clsx";
import React from "react";
import { PlusOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import { AppButton } from "@/components";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
type TablePaginationConfig = Exclude<GetProp<TableProps, "pagination">, boolean>;
interface DataType {
  key: string;
  id: number;
  username: string;
  name: string;
  phone: string;
  email: string;
  role_name: string;
}
const Toast = Swal.mixin({
  toast: true,
  position: "bottom-start",
  showConfirmButton: false,
  timer: 8000,
  timerProgressBar: true,
  didOpen: (toast) => {
    toast.onmouseenter = Swal.stopTimer;
    toast.onmouseleave = Swal.resumeTimer;
  }
});
interface TableParams {
  pagination?: TablePaginationConfig;
  sortField?: string;
  sortOrder?: string;
  filters?: Parameters<GetProp<TableProps, "onChange">>[1];
}
const UserList = () => {
  const columns: TableProps<DataType>["columns"] = [
    {
      title: "Username",
      dataIndex: "username",
      key: "username",
      render: (text) => <span>{text}</span>
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (text) => <span>{text}</span>
    },
    {
      title: "Phone",
      dataIndex: "phone",
      key: "phone",
      render: (text) => <span>{text}</span>
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      render: (text) => <span>{text}</span>
    },
    {
      title: "Role",
      dataIndex: "role_name",
      key: "role_name",
      render: (text) => <span>{text}</span>
    },
    {
      title: "",
      key: "action",
      render: (_, record) => (
        <div className={clsx(["flex", "justify-center", "gap-x-6"])}>
          <button className={clsx(["cursor-pointer"])} onClick={handleEdit(record.id)}>
            {t("Edit")}
          </button>
          <button className={clsx(["cursor-pointer"])} onClick={handleDelete(record.id)}>
            {t("Delete")}
          </button>
        </div>
      )
    }
  ];
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [userList, setUserList] = React.useState<DataType[]>([]);
  const [tableParams, setTableParams] = React.useState<TableParams>({
    pagination: {
      current: 1,
      pageSize: 50
    }
  });
  const loadUserList = () => {
    AxiosService()
      .get("/auth/user/list", { headers: { isShowLoading: true } })
      .then((response: any) => {
        let total = 0;
        const { checked, data } = response.data;
        if (checked && data && data.users && data.users.length > 0) {
          total = parseInt(data.total);
          setUserList(data.users);
        } else {
          setUserList([]);
        }
        setTableParams({
          ...tableParams,
          pagination: {
            ...tableParams.pagination,
            total
          }
        });
      });
  };
  React.useEffect(() => {
    loadUserList();
  }, []);
  const handleNewForm = () => {
    navigate("/admin/user/add");
  };
  const handleEdit = (id: number) => () => {
    navigate("/admin/user/edit/" + id);
  };
  const handleDelete = (id: number) => () => {
    Swal.fire({
      title: t("Do you want to delete this item?"),
      showDenyButton: true,
      confirmButtonText: "Confirm",
      denyButtonText: "Cancel"
    }).then((result) => {
      if (result.isConfirmed) {
        AxiosService()
          .put("/auth/user/delete/" + id, { headers: { isShowLoading: true } })
          .then((response: any) => {
            const { checked, message } = response.data;
            if (checked) {
              loadUserList();
              Toast.fire({
                icon: "success",
                title: t(message)
              });
            } else {
              Toast.fire({
                icon: "error",
                title: t(message)
              });
            }
          })
          .catch((err: any) => {
            Toast.fire({
              icon: "error",
              title: err.data.message
            });
          });
      }
    });
  };
  return (
    <React.Fragment>
      <Card
        title={
          <div className={clsx(["flex", "justify-between"])}>
            <span className={clsx(["text-3xl"])}>{t("Users")}</span>
            <AppButton lblCtrl={t("New")} iconCtrl={<PlusOutlined />} onClickForm={handleNewForm} />
          </div>
        }
      >
        <Table<DataType> columns={columns} dataSource={userList} pagination={tableParams.pagination} />
      </Card>
    </React.Fragment>
  );
};

export default UserList;
