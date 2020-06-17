import React, { useState } from 'react';
import { Redirect } from 'react-router-dom';
import { Form, Input, Row, Col, Button, Alert } from 'antd';
import { connect } from 'react-redux';
import * as actions from '../actions/actions';

const formItemLayout = {
  labelCol: {
    xs: {
      span: 24,
    },
    sm: {
      span: 8,
    },
  },
  wrapperCol: {
    xs: {
      span: 24,
    },
    sm: {
      span: 16,
    },
  },
};
const tailFormItemLayout = {
  wrapperCol: {
    xs: {
      span: 24,
      offset: 0,
    },
    sm: {
      span: 16,
      offset: 8,
    },
  },
};

const mapStateToProps = () => ({});

const mapDispatchToProps = (dispatch) => ({
  setUsername: (username) => {
    dispatch(actions.setUser(username));
  },
});

const Login = () => {
  const [redirect, setRedirect] = useState('');
  const [notice, setNotice] = useState('');
  const [form] = Form.useForm();

  const onFinish = (values) => {
    const data = {
      username: values.username,
      password: values.password,
    };

    // fetch request to login a user
    fetch('/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
      .then((res) => res.json())
      .then((resData) => {
        if (!resData.success) {
          // display the error as a notice in state
          setNotice(resData.message);
          form.setFieldsValue({ username: '', password: '' });
        } else if (resData.success) {
          // change redirect in local state to true
          props.setUsername(resData.username);
          setRedirect('/');
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  // redirect if redirect is populated
  if (redirect) {
    return <Redirect to={redirect} />;
  }

  return (
    <div className="site-layout-content">
      <Form
        {...formItemLayout}
        form={form}
        name="login"
        onFinish={onFinish}
        // scrollToFirstError
      >
        {/* conditionally render the alert if an error notice has occured */}
        {notice && <Alert style={{ marginBottom: 24 }} message={notice} type="error" showIcon closable />}

        <Form.Item
          name="username"
          label="Username"
          rules={[
            {
              required: true,
              message: 'Please input your username!',
              whitespace: true,
            },
          ]}
        >
          <Input onChange={() => setNotice('')} />
        </Form.Item>

        <Form.Item
          name="password"
          label="Password"
          rules={[
            {
              required: true,
              message: 'Please input your password!',
            },
          ]}
          hasFeedback
        >
          <Input.Password onChange={() => setNotice('')} />
        </Form.Item>

        <Form.Item {...tailFormItemLayout}>
          <Button type="primary" htmlType="submit">
            Log In
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(Login);
