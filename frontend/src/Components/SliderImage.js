import { Card, Row, Col } from "antd";
import berastagiImage from "../Styles/image/berastagi.jpg";
import niasImage from "../Styles/image/nias.jpg";
import kualanamuImage from "../Styles/image/kualanamu.jpg";
import medanImage from "../Styles/image/medan.jpg";
import siantarnImage from "../Styles/image/siantar.jpg";
import danauTobaImage from "../Styles/image/danau_toba.jpg";
import Meta from "antd/es/card/Meta";
import { Link } from "react-router-dom";

function SliderImage() {

  return (
    <Card className="container" bordered={false} style={{ marginLeft: 5 }}>
      <Row gutter={24} style={{ margin: 10 }}>
        <Col span={8}>
          <Link>
            <Card
              hoverable              
              cover={<img alt="example" src={berastagiImage} height={355} />}
            >
              <Meta title="Hotels in Berastagi" />
            </Card>
          </Link>
        </Col>
        <Col span={8}>
          <Link>
            <Card
              hoverable              
              cover={<img alt="example" src={siantarnImage} height={355} />}
            >
              <Meta title="Hotels in Siantar" />
            </Card>
          </Link>
        </Col>
        <Col span={8}>
          <Link>
            <Card
              hoverable              
              cover={<img alt="example" src={kualanamuImage} height={355} />}
            >
              <Meta title="Hotels in Kuala Namu" />
            </Card>
          </Link>
        </Col>
      </Row>
      <Row gutter={24} style={{ margin: 10 }}>
        <Col span={8}>
          <Link>
            <Card
              hoverable              
              cover={<img alt="example" src={medanImage} height={355} />}
            >
              <Meta title="Hotels in Medan" />
            </Card>
          </Link>
        </Col>
        <Col span={8}>
          <Link>
            <Card
              hoverable              
              cover={<img alt="example" src={niasImage} height={355} />}
            >
              <Meta title="Hotels in Nias" />
            </Card>
          </Link>
        </Col>
        <Col span={8}>
          <Link>
            <Card
              hoverable              
              cover={<img alt="example" src={danauTobaImage} height={355} />}
            >
              <Meta title="Hotels in Samosir" />
            </Card>
          </Link>
        </Col>
      </Row>
    </Card>
  );
}
export default SliderImage;
