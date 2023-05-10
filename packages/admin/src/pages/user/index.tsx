import React, { useState } from 'react';
import {
  Button,
  Card,
  Space,
  Typography,
  Layout,
  Table,
  Message,
  Popconfirm
} from '@arco-design/web-react';
import type { PaginationProps, TableColumnProps } from '@arco-design/web-react';
import { usePagination, useRequest } from 'ahooks';
import UserForm from './components/form-user';
import { initial } from './api';

const Title = Typography.Title;
const Text = Typography.Text;
const Header = Layout.Header;
const Footer = Layout.Footer;
const Content = Layout.Content;

export type User = typeof initial;

function UserIndex() {
  async function getTableData(pagination: PaginationProps) {
    const {
      data: list,
      meta: { total }
    } = await fetch(
      `/api/user?pageSize=${pagination.pageSize}&page=${pagination.current}`
    ).then((res) => res.json());
    return { list, total };
  }

  const { data, pagination, loading, refresh } = usePagination(getTableData, {
    defaultCurrent: 1,
    defaultPageSize: 2
  });

  async function deleteTableData(id: string) {
    const res = await fetch(`/api/user/${id}`, { method: 'delete' });
    const json = await res.json();
    return { ok: json.affected === 1 };
  }

  const tableCallback = async (
    record: User,
    type: 'edit' | 'delete' | 'changePWD'
  ) => {
    if (type === 'delete') {
      const { ok } = await deleteTableData(record._id);
      if (ok) {
        Message.success('删除用户成功!');
        refresh(); // 刷新
      } else {
        Message.error('删除用户失败!');
      }
    } else if (type === 'edit') {
      setEditedItem(record);
      setVisible(true);
    }
  };

  const columns: TableColumnProps[] = [
    {
      title: '手机号',
      dataIndex: 'phoneNumber'
    },
    {
      title: '用户名称',
      dataIndex: 'name'
    },
    {
      title: '用户头像',
      dataIndex: 'avatar',
      render(value: string) {
        return <img src={value} width="50" />;
      }
    },
    {
      title: '邮箱',
      dataIndex: 'email',
      placeholder: '-'
    },
    {
      title: '操作',
      dataIndex: 'operations',
      render: (_: unknown, record) => (
        <>
          <Button
            type="text"
            size="small"
            onClick={() => tableCallback(record, 'edit')}
          >
            编辑
          </Button>
          <Popconfirm
            focusLock
            title="确认删除吗?"
            okText="确认"
            cancelText="取消"
            onOk={() => tableCallback(record, 'delete')}
          >
            <Button type="text" size="small">
              删除
            </Button>
          </Popconfirm>
        </>
      )
    }
  ];
  const [editedItem, setEditedItem] = useState(initial);
  const [visible, setVisible] = useState(false);
  const onAddUser = () => {
    setEditedItem(initial);
    setVisible(true);
  };
  return (
    <Card>
      <Layout style={{ height: '400px' }}>
        <Header>
          {/* 标题 */}
          <Title heading={6}>用户管理</Title>
          <Space direction="vertical">
            {/* 操作按钮 */}
            <Button
              onClick={onAddUser}
              type="primary"
              style={{ marginBottom: 10 }}
            >
              新增
            </Button>
            <UserForm
              {...{ visible, setVisible, editedItem, callback: refresh }}
            ></UserForm>
          </Space>
        </Header>
        <Content>
          {/* 页面内容 */}
          <Table
            data={data?.list}
            loading={loading}
            columns={columns}
            pagination={pagination}
            rowKey="_id"
            style={{ width: '100%' }}
          ></Table>
        </Content>
      </Layout>
    </Card>
  );
}

export default UserIndex;
