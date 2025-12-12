import { AxiosService } from "@/utils";
import { PlusOutlined } from "@ant-design/icons";
import { Table, type TableProps, Card, type GetProp } from "antd";
import clsx from "clsx";
import React from "react";
import { useTranslation } from "react-i18next";
import { AppButton } from "@/components";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { useAppDispatch, useAuth } from "@/hooks";
import { loginAction } from "@/slices";
import { produce } from "immer";
type TablePaginationConfig = Exclude<GetProp<TableProps, "pagination">, boolean>;
type IRole = {
  menu_id: number;
  role_id: number;
  role_name: string;
};
interface IMenu {
  key: string;
  id: number;
  name: string;
  url: string;
  role_name: string[];
  role_list: IRole[];
}
interface TableParams {
  pagination?: TablePaginationConfig;
  sortField?: string;
  sortOrder?: string;
  filters?: Parameters<GetProp<TableProps, "onChange">>[1];
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
  const columns: TableProps<IMenu>["columns"] = [
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
      title: "Role",
      key: "role_name",
      dataIndex: "role_name",
      render: (_, { role_list }) => {
        return (
          <React.Fragment>
            {role_list && role_list.length > 0 && (
              <div className={clsx(["flex", "gap-x-2"])}>
                {role_list.map((elmt: IRole, idx: number) => {
                  return (
                    <div key={`role-${idx}`} className={clsx(["bg-gray-100", "border", "border-gray-300", "rounded-sm", "pl-2", "pr-2", "text-xs"])}>
                      {elmt.role_name}
                    </div>
                  );
                })}
              </div>
            )}
          </React.Fragment>
        );
      }
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
  const [menuList, setMenuList] = React.useState<IMenu[]>([]);
  const [tableParams, setTableParams] = React.useState<TableParams>({
    pagination: {
      current: 1,
      pageSize: 50
    }
  });
  const loadMenuList = () => {
    AxiosService()
      .get("/auth/menu/list", { headers: { isShowLoading: true } })
      .then((response: any) => {
        let total = 0;
        const { checked, data } = response.data;
        if (checked && data && data.menus && data.menus.length > 0) {
          total = parseInt(data.total);
          let menuData: IMenu[] = data.menus;
          let menuRoleData: IRole[] = data.menu_role;
          const nextState: IMenu[] = produce(menuData, (draft) => {
            if (menuRoleData.length > 0) {
              draft.forEach((elmt: IMenu) => {
                let menuId: number = elmt.id;
                let menuRoleFiltered: IRole[] = menuRoleData.filter((item) => item.menu_id === menuId);
                elmt.role_list = menuRoleFiltered;
              });
            }
          });
          setMenuList(nextState);
        } else {
          setMenuList([]);
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
        <Table<IMenu> columns={columns} dataSource={menuList} pagination={tableParams.pagination} />
      </Card>
    </React.Fragment>
  );
};

export default MenuList;
