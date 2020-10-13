import React from "react";
//Components
import { Form, Input, Button, Space, Select, InputNumber } from "antd";
import { DeleteOutlined, PlusOutlined } from "@ant-design/icons";
//Functions
import { map } from "lodash";
import { series } from "async";

import "./AlternativesForm.scss";

export default function AlternativesForm(props) {
  const { criteria, setAlternatives, next, prev } = props;

  const onFinish = (values) => {
    console.log(values.alternatives);
    series([
      function (callback) {
        setAlternatives(values.alternatives);
        callback(null, "one");
      },
      function (callback) {
        next();
        callback(null, "two");
      },
    ]);
  };

  return (
    <div className="alternatives-form">
      <Form
        name="dynamic_form_nest_item"
        onFinish={onFinish}
        autoComplete="off"
      >
        <Form.List name="alternatives">
          {(fields, { add, remove }) => {
            return (
              <div>
                {fields.map((field) =>
                  criteria ? (
                    <div className="alternatives-form-alternative">
                      <Form.Item
                        {...field}
                        name={[field.name, "name"]}
                        fieldKey={[field.fieldKey, "name"]}
                        rules={[
                          {
                            required: true,
                            message:
                              "Por favor introduce el nombre de la alternativa.",
                          },
                        ]}
                      >
                        <Input placeholder="Alternativa" />
                      </Form.Item>
                      {map(criteria, (criteria) => (
                        <Space
                          key={field.key}
                          style={{
                            display: "flex",
                            marginBottom: 8,
                          }}
                          align="start"
                        >
                          <Form.Item
                            {...field}
                            name={[field.name, `${criteria.name}`]}
                            fieldKey={[field.fieldKey, `${criteria.name}`]}
                            rules={[
                              {
                                required: true,
                                message: `${criteria.name}`,
                              },
                            ]}
                          >
                            <Input placeholder={`${criteria.name}`} />
                          </Form.Item>
                        </Space>
                      ))}
                      <DeleteOutlined
                        onClick={() => {
                          remove(field.name);
                        }}
                      />
                    </div>
                  ) : (
                    <></>
                  )
                )}
                <Form.Item>
                  <Button
                    type="dashed"
                    onClick={() => {
                      console.log(criteria);
                      add();
                    }}
                    block
                  >
                    <PlusOutlined /> Nueva Alternativa
                  </Button>
                </Form.Item>
              </div>
            );
          }}
        </Form.List>

        <Form.Item>
          <Button
            type="primary"
            onClick={() => prev()}
            shape="round"
            className="next"
          >
            Anterior
          </Button>
          <Button
            type="primary"
            htmlType="submit"
            shape="round"
            className="next"
          >
            Siguiente
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}
