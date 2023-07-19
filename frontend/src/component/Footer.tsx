import { Row, Col } from 'antd';
import { FacebookFilled, TwitterOutlined, GoogleOutlined, InstagramOutlined, LinkedinFilled, GithubFilled } from '@ant-design/icons';

const Footer = () => {
  return (
    <footer style={{ backgroundColor: '#050505' }}>
      <div className="container p-4">
        <section className="mb-4">
          <Row justify="center">
            <Col>
              <a className="btn btn-primary btn-floating m-1" style={{ backgroundColor: '#3b5998' }} href="#!" role="button"><FacebookFilled /></a>
            </Col>
            <Col>
              <a className="btn btn-primary btn-floating m-1" style={{ backgroundColor: '#55acee' }} href="#!" role="button"><TwitterOutlined /></a>
            </Col>
            <Col>
              <a className="btn btn-primary btn-floating m-1" style={{ backgroundColor: '#dd4b39' }} href="#!" role="button"><GoogleOutlined /></a>
            </Col>
            <Col>
              <a className="btn btn-primary btn-floating m-1" style={{ backgroundColor: '#ac2bac' }} href="#!" role="button"><InstagramOutlined /></a>
            </Col>
            <Col>
              <a className="btn btn-primary btn-floating m-1" style={{ backgroundColor: '#0082ca' }} href="#!" role="button"><LinkedinFilled /></a>
            </Col>
            <Col>
              <a className="btn btn-primary btn-floating m-1" style={{ backgroundColor: '#333333' }} href="#!" role="button"><GithubFilled /></a>
            </Col>
          </Row>
        </section>
        <section className="mb-4">
          <Row justify="center">
            <Col span={18}>
              <p>
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Sunt
                distinctio earum repellat quaerat voluptatibus placeat nam,
                commodi optio pariatur est quia magnam eum harum corrupti dicta,
                aliquam sequi voluptate quas.
              </p>
            </Col>
          </Row>
        </section>
        <section>
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={12} md={6}>
              <h5 className="text-uppercase">Links</h5>
              <ul className="list-unstyled mb-0">
                <li>
                  <a href="#!" className="text-white">Link 1</a>
                </li>
                <li>
                  <a href="#!" className="text-white">Link 2</a>
                </li>
                <li>
                  <a href="#!" className="text-white">Link 3</a>
                </li>
                <li>
                  <a href="#!" className="text-white">Link 4</a>
                </li>
              </ul>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <h5 className="text-uppercase">Links</h5>
              <ul className="list-unstyled mb-0">
                <li>
                  <a href="#!" className="text-white">Link 1</a>
                </li>
                <li>
                  <a href="#!" className="text-white">Link 2</a>
                </li>
                <li>
                  <a href="#!" className="text-white">Link 3</a>
                </li>
                <li>
                  <a href="#!" className="text-white">Link 4</a>
                </li>
              </ul>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <h5 className="text-uppercase">Links</h5>
              <ul className="list-unstyled mb-0">
                <li>
                  <a href="#!" className="text-white">Link 1</a>
                </li>
                <li>
                  <a href="#!" className="text-white">Link 2</a>
                </li>
                <li>
                  <a href="#!" className="text-white">Link 3</a>
                </li>
                <li>
                  <a href="#!" className="text-white">Link 4</a>
                </li>
              </ul>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <h5 className="text-uppercase">Links</h5>
              <ul className="list-unstyled mb-0">
                <li>
                  <a href="#!" className="text-white">Link 1</a>
                </li>
                <li>
                  <a href="#!" className="text-white">Link 2</a>
                </li>
                <li>
                  <a href="#!" className="text-white">Link 3</a>
                </li>
                <li>
                  <a href="#!" className="text-white">Link 4</a>
                </li>
              </ul>
            </Col>
          </Row>
        </section>
      </div>
    </footer>
  );
}

export default Footer;
