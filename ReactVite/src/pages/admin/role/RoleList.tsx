import { AxiosService } from "@/utils";
import { PlusOutlined } from "@ant-design/icons";
import { Table, type TableProps, Card } from "antd";
import clsx from "clsx";
import React from "react";
import { useTranslation } from "react-i18next";
import { AppButton } from "@/components";
import { useNavigate } from "react-router-dom";
interface DataType {
  key: string;
  name: string;
}
const RoleList = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
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
  const [roleList, setRoleList] = React.useState<DataType[]>([]);
  React.useEffect(() => {
    const loadRoleList = () => {
      AxiosService()
        .get("/auth/role/list", { headers: { isShowLoading: true } })
        .then((response: any) => {
          const { checked, data } = response.data;
          const { roles } = data;
          if (checked) {
            setRoleList(roles);
          }
        });
    };
    loadRoleList();
  }, []);
  const handleNewForm = () => {
    navigate("/admin/role/add");
  };
  return (
    <Card
      title={
        <div className={clsx(["flex", "justify-between"])}>
          <span className={clsx(["text-3xl"])}>{t("Roles")}</span>
          <AppButton lblCtrl={t("New")} iconCtrl={<PlusOutlined />} onClickForm={handleNewForm} />
        </div>
      }
    >
      <Table<DataType> columns={columns} dataSource={roleList} />
    </Card>
  );
};

export default RoleList;
