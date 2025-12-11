import { AppButton } from "@/components";
import { AxiosService } from "@/utils";
import { RollbackOutlined } from "@ant-design/icons";
import { Card, Col, Form, Input, Row, type FormProps, Button } from "antd";
import clsx from "clsx";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
type FieldType = {
  role_name?: string;
};
const RoleForm = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const handleBack = () => {
    navigate("/admin/role/list");
  };
  const onFinish: FormProps<FieldType>["onFinish"] = (values) => {
    console.log("Success:", values);
    AxiosService()
      .post("/auth/role/create", {}, { headers: {} })
      .then((response: any) => {});
  };
  return (
    <Form name="basic" onFinish={onFinish} layout="vertical">
      <Card
        title={
          <div className={clsx(["flex", "justify-between"])}>
            <span className={clsx(["text-3xl", "uppercase"])}>{t("Create role")}</span>
            <AppButton lblCtrl={t("Back")} iconCtrl={<RollbackOutlined />} onClickForm={handleBack} />
          </div>
        }
      >
        <Row gutter={16}>
          <Col span={6}>
            <Form.Item<FieldType> label={t("Role")} name="role_name" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <Form.Item label={null}>
              <Button type="primary" htmlType="submit">
                {t("Save")}
              </Button>
            </Form.Item>
          </Col>
        </Row>
      </Card>
    </Form>
  );
};

export default RoleForm;
