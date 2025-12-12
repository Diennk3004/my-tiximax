import { AppButton } from "@/components";
import Swal from "sweetalert2";
import React from "react";
import { AxiosService } from "@/utils";
import { RollbackOutlined } from "@ant-design/icons";
import { Card, Col, Form, Input, Row, type FormProps, Button, Select } from "antd";
import clsx from "clsx";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import { produce } from "immer";
type FieldType = {
  name?: string;
  email?: string;
  username?: string;
  password?: string;
  password_confirmed?: string;
  phone?: string;
  role_id?: number;
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
const UserForm = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { user_id } = useParams();
  const [frmSave] = Form.useForm();
  const [roleList, setRoleList] = React.useState<IRole[]>([]);
  const handleBack = () => {
    navigate("/admin/user/list");
  };
  const onFinish: FormProps<FieldType>["onFinish"] = (values) => {
    const { username, name, email, phone, password, password_confirmed, role_id } = values;
    let checked: boolean = true;
    if (user_id) {
      if (password && password_confirmed) {
        if (password.length >= 5 && password_confirmed.length >= 5) {
          if (password !== password_confirmed) {
            frmSave.setFields([
              {
                name: "password_confirmed",
                errors: ["Password confirmed is not matched to password"]
              }
            ]);
            checked = false;
          }
        } else {
          if (password.length < 5) {
            frmSave.setFields([{ name: "password", errors: ["Password length must be greater than 6 characters"] }]);
            checked = false;
          }
          if (password_confirmed.length < 6) {
            frmSave.setFields([
              {
                name: "password",
                errors: ["Password confirmed length must be greater than 6 characters"]
              }
            ]);
            checked = false;
          }
        }
      }
    } else {
      if (password && password_confirmed) {
        if (password.length >= 5 && password_confirmed.length >= 5) {
          if (password !== password_confirmed) {
            frmSave.setFields([
              {
                name: "password_confirmed",
                errors: ["Password confirmed is not matched to password"]
              }
            ]);
            checked = false;
          }
        } else {
          if (password.length < 5) {
            frmSave.setFields([{ name: "password", errors: ["Password length must be greater than 6 characters"] }]);
            checked = false;
          }
          if (password_confirmed.length < 6) {
            frmSave.setFields([
              {
                name: "password",
                errors: ["Password confirmed length must be greater than 6 characters"]
              }
            ]);
            checked = false;
          }
        }
      } else {
        if (!password) {
          frmSave.setFields([
            {
              name: "password",
              errors: ["Password is required"]
            }
          ]);
          checked = false;
        }
        if (!password_confirmed) {
          frmSave.setFields([
            {
              name: "password_confirmed",
              errors: ["Password confirm is required"]
            }
          ]);
          checked = false;
        }
      }
    }
    if (checked) {
      let actionUrl: string = "";
      if (user_id) {
        actionUrl = "/auth/user/save/" + user_id;
      } else {
        actionUrl = "/auth/user/save";
      }
      AxiosService()
        .post(
          actionUrl,
          {
            username: username ? username.trim() : "",
            password: password ? password.trim() : "",
            password_confirmed: password_confirmed ? password_confirmed.trim() : "",
            name: name ? name.trim() : "",
            email: email ? email.trim() : "",
            phone: phone ? phone.trim() : "",
            role_id: role_id ? role_id : null
          },
          { headers: { isShowLoading: true } }
        )
        .then((response: any) => {
          const { checked, message } = response.data;
          if (checked === true) {
            Toast.fire({
              icon: "success",
              title: t(message)
            });
            navigate("/admin/user/list");
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
  React.useEffect(() => {
    const loadUserItem = () => {
      if (user_id) {
        AxiosService()
          .get("/auth/user/detail/" + user_id, { headers: { isShowloading: true } })
          .then((response: any) => {
            const { data, checked, message } = response.data;
            if (checked === true && data && data.user) {
              const { username, name, email, phone, role_id } = data.user;
              frmSave.setFieldValue("username", username);
              frmSave.setFieldValue("name", name);
              frmSave.setFieldValue("email", email);
              frmSave.setFieldValue("phone", phone);
              frmSave.setFieldValue("role_id", role_id ? role_id.toString() : "");
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
    loadUserItem();
  }, [user_id]);
  React.useEffect(() => {
    const loadRoleList = () => {
      AxiosService()
        .get("/auth/role/list", { headers: { isShowLoading: true } })
        .then((response: any) => {
          const { data, checked, message } = response.data;
          if (checked && data && data.roles && data.roles.length > 0) {
            const list: IRole[] = data.roles;
            list.unshift({ id: 0, name: "---Please select role---", label: "", value: "" });
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
    <Form name="basic" onFinish={onFinish} layout="vertical" form={frmSave}>
      <Card
        title={
          <div className={clsx(["flex", "justify-between"])}>
            <span className={clsx(["text-3xl", "uppercase"])}>{user_id ? t("Edit user") : t("Create user")}</span>
            <AppButton lblCtrl={t("Back")} iconCtrl={<RollbackOutlined />} onClickForm={handleBack} />
          </div>
        }
      >
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item<FieldType> label={t("Username")} name="username" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item<FieldType> label={t("Name")} name="name" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item<FieldType> label={t("Password")} name="password">
              <Input.Password />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item<FieldType> label={t("Confirmed password")} name="password_confirmed">
              <Input.Password />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item<FieldType> label={t("Email")} name="email" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item<FieldType> label={t("Phone")} name="phone" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col span={12}>
            <Form.Item<FieldType> label={t("Role")} name="role_id" rules={[{ required: true }]}>
              <Select allowClear placeholder={t("Select a option and change input text above")} options={roleList} />
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

export default UserForm;
