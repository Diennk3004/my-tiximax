import { AxiosService } from "@/utils";
import { PlusOutlined } from "@ant-design/icons";
import { Table, type TableProps, Card } from "antd";
import clsx from "clsx";
import React from "react";
import { useTranslation } from "react-i18next";
import { AppButton } from "@/components";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { useAppDispatch, useAuth } from "@/hooks";
import { loginAction } from "@/slices";
interface DataType {
  key: string;
  id: number;
  name: string;
  url: string;
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
const MenuList = () => {
  const columns: TableProps<DataType>["columns"] = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (text) => <span>{text}</span>
    },
    {
      title: "Url",
      dataIndex: "url",
      key: "url",
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
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { user } = useAuth();
  const [menuList, setMenuList] = React.useState<DataType[]>([]);
  const loadMenuList = () => {
    AxiosService()
      .get("/auth/menu/list", { headers: { isShowLoading: true } })
      .then((response: any) => {
        const { checked, data } = response.data;
        const { menus } = data;
        if (checked) {
          setMenuList(menus);
        }
      });
  };
  React.useEffect(() => {
    loadMenuList();
  }, []);
  const handleNewForm = () => {
    navigate("/admin/menu/add");
  };
  const handleEdit = (id: number) => () => {
    navigate("/admin/menu/edit/" + id);
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
          .put("/auth/menu/delete/" + id, { headers: { isShowLoading: true } })
          .then((response: any) => {
            const { checked, message } = response.data;
            if (checked) {
              loadMenuList();
              if (user) {
                dispatch(loginAction(user));
              }
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
            <span className={clsx(["text-3xl"])}>{t("Menu")}</span>
            <AppButton lblCtrl={t("New")} iconCtrl={<PlusOutlined />} onClickForm={handleNewForm} />
          </div>
        }
      >
        <Table<DataType> columns={columns} dataSource={menuList} />
      </Card>
    </React.Fragment>
  );
};

export default MenuList;
