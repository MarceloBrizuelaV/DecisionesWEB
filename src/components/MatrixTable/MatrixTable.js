import React from "react";
//Components
import { Table } from "antd";
import { map } from "lodash";

import "./MatrixTable.scss";

export default function MatrixTable(props) {
  const { data, criteria } = props;

  return (
    <div className="matrix-table">
      <Table dataSource={data}>
        <Table.Column dataIndex="name" title="Alternativa" />
        {map(criteria, (criteria) => (
          <Table.Column dataIndex={criteria.name} title={`${criteria.name}`} />
        ))}
      </Table>
    </div>
  );
}
