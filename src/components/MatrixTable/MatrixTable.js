import React from "react";
//Components
import { Table } from "antd";
import { map } from "lodash";

export default function MatrixTable(props) {
  const { data, criteria } = props;

  return (
    <div>
      <Table dataSource={data.alternatives}>
        <Table.Column dataIndex="name" title="Alternativa" />
        {map(criteria.criteria, (criteria) => (
          <Table.Column dataIndex={criteria.name} title={`${criteria.name}`} />
        ))}
      </Table>
    </div>
  );
}
