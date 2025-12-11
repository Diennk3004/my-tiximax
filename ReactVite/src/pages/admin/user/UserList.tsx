import { AxiosService } from "@/utils";
import { Table, type TableProps, Card } from "antd";
import clsx from "clsx";
import React from "react";
import { useTranslation } from "react-i18next";
interface DataType {
  key: string;
  name: string;
}
const UserList = () => {
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
  const [userList, setUserList] = React.useState<DataType[]>([]);
  React.useEffect(() => {
    const loadUserList = () => {
      AxiosService()
        .get("/auth/user/list", { headers: { isShowLoading: true } })
        .then((response: any) => {
          const { checked, data } = response.data;
          const { users } = data;
          if (checked) {
            setUserList(users);
          }
        });
    };
    loadUserList();
  }, []);
  return (
    <React.Fragment>
      <Card title={<span className={clsx(["text-3xl"])}>{t("Users")}</span>}>
        <Table<DataType> columns={columns} dataSource={userList} />
      </Card>
    </React.Fragment>
  );
};

export default UserList;
