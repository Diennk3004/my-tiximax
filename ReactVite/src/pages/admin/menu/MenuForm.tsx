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
  menu_name?: string;
  menu_url?: string;
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
const MenuForm = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { menu_id } = useParams();
  const [frm] = Form.useForm();
  const handleBack = () => {
    navigate("/admin/menu/list");
  };
  const onFinish: FormProps<FieldType>["onFinish"] = (values) => {
    const { menu_name, menu_url } = values;
    let actionUrl: string = "";
    if (menu_id) {
      actionUrl = "/auth/menu/save/" + menu_id;
    } else {
      actionUrl = "/auth/menu/save";
    }
    AxiosService()
      .post(actionUrl, { name: menu_name ? menu_name.trim() : "", url: menu_url ? menu_url.trim() : "" }, { headers: { isShowLoading: true } })
      .then((response: any) => {
        const { checked, message } = response.data;
        if (checked === true) {
          Toast.fire({
            icon: "success",
            title: t(message)
          });
          navigate("/admin/menu/list");
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
    const loadMenuItem = () => {
      if (menu_id) {
        AxiosService()
          .get("/auth/menu/detail/" + menu_id, { headers: { isShowloading: true } })
          .then((response: any) => {
            const { data, checked, message } = response.data;
            if (checked === true && data && data.menu) {
              const { name, url } = data.menu;
              frm.setFieldValue("menu_name", name);
              frm.setFieldValue("menu_url", url);
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
    };
    loadMenuItem();
  }, [menu_id]);
  return (
    <Form name="basic" onFinish={onFinish} layout="vertical" form={frm}>
      <Card
        title={
          <div className={clsx(["flex", "justify-between"])}>
            <span className={clsx(["text-3xl", "uppercase"])}>{menu_id ? t("Edit menu") : t("Create menu")}</span>
            <AppButton lblCtrl={t("Back")} iconCtrl={<RollbackOutlined />} onClickForm={handleBack} />
          </div>
        }
      >
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item<FieldType> label={t("Menu name")} name="menu_name" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item<FieldType> label={t("Menu url")} name="menu_url" rules={[{ required: true }]}>
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

export default MenuForm;
