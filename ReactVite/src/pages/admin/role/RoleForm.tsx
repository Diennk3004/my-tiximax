import { AppButton } from "@/components";
import Swal from "sweetalert2";
import React from "react";
import { AxiosService } from "@/utils";
import { RollbackOutlined } from "@ant-design/icons";
import { Card, Col, Form, Input, Row, type FormProps, Button } from "antd";
import clsx from "clsx";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
type FieldType = {
  role_name?: string;
};
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
const RoleForm = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { role_id } = useParams();
  const [frm] = Form.useForm();
  const handleBack = () => {
    navigate("/admin/role/list");
  };
  const onFinish: FormProps<FieldType>["onFinish"] = (values) => {
    const { role_name } = values;
    let actionUrl: string = "";
    if (role_id) {
      actionUrl = "/auth/role/save/" + role_id;
    } else {
      actionUrl = "/auth/role/save";
    }
    AxiosService()
      .post(actionUrl, { name: role_name }, { headers: { isShowLoading: true } })
      .then((response: any) => {
        const { checked, message } = response.data;
        if (checked === true) {
          Toast.fire({
            icon: "success",
            title: t(message)
          });
          navigate("/admin/role/list");
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
  };
  React.useEffect(() => {
    const loadRoleItem = () => {
      AxiosService()
        .get("/auth/role/detail/" + role_id, { headers: { isShowloading: true } })
        .then((response: any) => {
          const { data, checked, message } = response.data;
          if (checked === true && data && data.role) {
            const { name } = data.role;
            frm.setFieldValue("role_name", name);
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
    };
    loadRoleItem();
  }, [role_id]);
  return (
    <Form name="basic" onFinish={onFinish} layout="vertical" form={frm}>
      <Card
        title={
          <div className={clsx(["flex", "justify-between"])}>
            <span className={clsx(["text-3xl", "uppercase"])}>{role_id ? t("Edit role") : t("Create role")}</span>
            <AppButton lblCtrl={t("Back")} iconCtrl={<RollbackOutlined />} onClickForm={handleBack} />
          </div>
        }
      >
        <Row gutter={16}>
          <Col span={6}>
            <Form.Item<FieldType> label={t("Role name")} name="role_name" rules={[{ required: true }]}>
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
