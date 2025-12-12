import { AppButton } from "@/components";
import { AxiosService } from "@/utils";
import { RollbackOutlined } from "@ant-design/icons";
import { Button, Card, Col, Form, Input, Row, Select, type FormProps } from "antd";
import clsx from "clsx";
import { produce } from "immer";
import React from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
type FieldType = {
  menu_name?: string;
  menu_url?: string;
  role_ids?: string;
};
type IRole = {
  label: string;
  value: string;
  id: number;
  name: string;
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
  const [roleList, setRoleList] = React.useState<IRole[]>([{ label: "Admin", value: "1", id: 1, name: "Admin" }]);
  const handleBack = () => {
    navigate("/admin/menu/list");
  };
  const onFinish: FormProps<FieldType>["onFinish"] = (values) => {
    const { menu_name, menu_url, role_ids } = values;
    let actionUrl: string = "";
    if (menu_id) {
      actionUrl = "/auth/menu/save/" + menu_id;
    } else {
      actionUrl = "/auth/menu/save";
    }
    AxiosService()
      .post(actionUrl, { name: menu_name ? menu_name.trim() : "", url: menu_url ? menu_url.trim() : "", role_ids: role_ids ? role_ids : "" }, { headers: { isShowLoading: true } })
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
              const list: IRole[] = data.menu_role;
              let idRoleList: string[] = [];
              for (var i = 0; i < list.length; i++) {
                idRoleList.push(list[i].id.toString());
              }
              frm.setFieldValue("role_ids", idRoleList);
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
  React.useEffect(() => {
    const loadRoleList = () => {
      AxiosService()
        .get("/auth/role/list", { headers: { isShowLoading: true } })
        .then((response: any) => {
          const { data, checked, message } = response.data;
          if (checked && data && data.roles && data.roles.length > 0) {
            const list: IRole[] = data.roles;
            const nextState = produce(list, (draft) => {
              draft.forEach((item: IRole) => {
                item.label = item.name.toString().trim();
                item.value = item.id.toString().trim();
              });
            });
            setRoleList(nextState);
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
            title: err.data && err.data.message ? err.data.message : ""
          });
        });
    };
    loadRoleList();
  }, []);
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
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item<FieldType> label={t("Roles")} name="role_ids" rules={[{ required: true }]}>
              <Select mode="multiple" allowClear className={clsx(["w-full"])} defaultValue={["1"]} placeholder="Please select" options={roleList} />
            </Form.Item>
          </Col>
          <Col span={12}></Col>
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
