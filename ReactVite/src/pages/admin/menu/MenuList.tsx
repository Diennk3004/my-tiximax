import { AxiosService } from "@/utils";
import { Table, type TableProps, Card } from "antd";
import clsx from "clsx";
import React from "react";
import { useTranslation } from "react-i18next";
interface DataType {
  key: string;
  name: string;
}
const MenuList = () => {
  const { t } = useTranslation();
  const columns: TableProps<DataType>["columns"] = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (text) => <span>{text}</span>
    },
    {
      title: "",
      key: "action",
      render: (_, record) => (
        <div className={clsx(["flex", "justify-center", "gap-x-6"])}>
          <button className={clsx(["cursor-pointer"])}>{t("Edit")}</button>
          <button className={clsx(["cursor-pointer"])}>{t("Delete")}</button>
        </div>
      )
    }
  ];
  const [menuList, setMenuList] = React.useState<DataType[]>([]);
  React.useEffect(() => {
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
    loadMenuList();
  }, []);
  return (
    <React.Fragment>
      <Card title={<span className={clsx(["text-3xl"])}>{t("Menu")}</span>}>
        <Table<DataType> columns={columns} dataSource={menuList} />
      </Card>
    </React.Fragment>
  );
};

export default MenuList;
