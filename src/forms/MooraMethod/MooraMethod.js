import React from "react";
//Components
import { Form, Select, Button } from "antd";
import { series } from "async";

import "./MooraMethod.scss";

export default function MooraMethod(props) {
  const { Option } = Select;
  const { next, setMooraMethod, calculate } = props;

  const onFinish = (values) => {
    series([
      function (callback) {
        setMooraMethod(values.method);
        callback(null, "one");
      },
      function (callback) {
        calculate();
        next();
        callback(null, "two");
      },
    ]);
  };

  return (
    <div className="moora-method">
      <Form name="moora-method" onFinish={onFinish}>
        <Form.Item
          name="method"
          rules={[
            {
              required: true,
              message: "Por favor ingresa el peso del criterio.",
            },
          ]}
        >
          <Select
            placeholder="Tipo de Moora"
            onChange={(value) => setMooraMethod(value)}
          >
            <Option value="referencePoint">Por Punto de Referencia</Option>
            <Option value="base">Base</Option>
          </Select>
        </Form.Item>
        <Form.Item>
          <Button htmlType="submit" shape="round" type="primary">
            Calcular
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}
