import React from "react";
//Components
import { series } from "async";
import { Form, Select, Button } from "antd";

import "./NormalizationForm.scss";

export default function NormalizationForm(props) {
  const { setNormalization, next, buttonTitle } = props;
  const { Option } = Select;

  const onFinish = (values) => {
    series([
      function (callback) {
        setNormalization(values.normalization);
        callback(null, "one");
      },
      function (callback) {
        next();
        callback(null, "two");
      },
    ]);
  };

  return (
    <div className="normalization-form">
      <Form onFinish={onFinish} autoComplete="off">
        <Form.Item
          name="normalization"
          rules={[
            {
              required: true,
              message: "Por favor ingresa el método de Normalización",
            },
          ]}
        >
          <Select placeholder="Método de Normalización">
            <Option value="maximum">Por Máximo</Option>
            <Option value="sum">Por la Suma</Option>
            <Option value="root">Raiz Sumatoria de Cuadrados</Option>
            <Option value="difference">Diferencia de Max y Min</Option>
          </Select>
        </Form.Item>
        <Form.Item>
          <Button htmlType="submit" type="primary" shape="round">
            {buttonTitle}
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}
