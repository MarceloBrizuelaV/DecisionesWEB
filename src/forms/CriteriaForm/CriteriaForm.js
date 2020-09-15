import React from "react";
//Components
import { Form, Input, Button, Space, Select, InputNumber } from "antd";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";

import "./CriteriaForm.scss";

export default function CriteriaForm() {
  const onFinish = (values) => {
    console.log(values);
  };

  const { Option } = Select;

  return (
    <div className="criteria-form">
      <Form
        name="dynamic_form_nest_item"
        onFinish={onFinish}
        autoComplete="off"
      >
        <Form.List name="criterias">
          {(fields, { add, remove }) => {
            return (
              <div>
                {fields.map((field) => (
                  <Space
                    key={field.key}
                    style={{ display: "flex", marginBottom: 8 }}
                    align="start"
                  >
                    <Form.Item
                      {...field}
                      name={[field.name, "name"]}
                      fieldKey={[field.fieldKey, "name"]}
                      rules={[
                        {
                          required: true,
                          message: "Por favor ingresa el nombre del criterio",
                        },
                      ]}
                    >
                      <Input placeholder="Criterio" />
                    </Form.Item>
                    <Form.Item
                      {...field}
                      name={[field.name, "kind"]}
                      fieldKey={[field.fieldKey, "kind"]}
                    >
                      <Select defaultValue="max" style={{ width: 120 }}>
                        <Option value="max">Max</Option>
                        <Option value="min">Min</Option>
                      </Select>
                    </Form.Item>
                    <Form.Item
                      {...field}
                      name={[field.name, "weight"]}
                      fieldKey={[field.fieldKey, "weight"]}
                      rules={[
                        {
                          required: true,
                          message: "Por favor ingresa el peso del criterio.",
                        },
                      ]}
                    >
                      <InputNumber />
                    </Form.Item>

                    <MinusCircleOutlined
                      onClick={() => {
                        remove(field.name);
                      }}
                    />
                  </Space>
                ))}

                <Form.Item>
                  <Button
                    type="dashed"
                    onClick={() => {
                      add();
                    }}
                    block
                  >
                    <PlusOutlined /> Nuevo Criterio
                  </Button>
                </Form.Item>
              </div>
            );
          }}
        </Form.List>

        <Form.Item>
          <Button type="primary" htmlType="submit">
            Siguiente
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}
