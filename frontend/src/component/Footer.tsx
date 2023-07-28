import { Row, Col, Input, QRCode, Space } from 'antd';
import React from 'react';

const Footer = () => {
  const [text, setText] = React.useState('https://ant.design/');
  return (
    <footer style={{ backgroundColor: '#ffffff', height: '100%', padding: '10px' }}>
      <>
        <Row style={{ height: '50%', backgroundColor: '#ffffff' }}>
          <Col span={24}>col</Col>
        </Row>
        <Row>
          <Col span={24}>
              <QRCode value={text || '-'} />
              <Input
                placeholder="-"
                maxLength={60}
                value={text}
                onChange={(e) => setText(e.target.value)}
              />
          </Col>


        </Row>
      </>
    </footer>
  );
}

export default Footer;
