import { Button, Card, Checkbox, Col, Form, Row, Slider } from "antd";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Filters = ({ data }) => {
  const [customPayload, setCustomPayload] = useState({});
  const navigate = useNavigate();
  const onValueChange = (key, value) => {
    console.log(value);
    setCustomPayload((prevState) => ({
      ...prevState,
      [key]: value,
    }));
  };
  const filterSubmit = () => {
    navigate(`/HotelList?ratings=${customPayload["ratings"]}&sort=desc`, {
      state: data,
    });
  };
  const resetFilter = () => {
    setCustomPayload({});
  };
  console.log(customPayload);
  return (
    <Card bordered={false}>
      <br />
      <Form labelWrap wrapperCol={{ flex: 1 }} style={{ margin: 10 }}>
        {customPayload !== null && (
          <Button type="secondary" onClick={resetFilter}>
            Reset Filters
          </Button>
        )}
        <Form.Item
          label="Property Prices"
          name="prices"
          labelCol={{ span: 24 }}
          wrapperCol={{ span: 24 }}
        >
          <Slider
            range
            defaultValue={[100000, 3000000]}
            tooltip={{ open: true }}
            min={0}
            max={5000000}
            onChange={(event) => onValueChange("prices", event)}
          />
        </Form.Item>
        <Form.Item
          label="Property Rating"
          name="ratings"
          labelCol={{ span: 24 }}
          wrapperCol={{ span: 24 }}
        >
          <Checkbox.Group onChange={(event) => onValueChange("ratings", event)}>
            <Row>
              <Col span={8}>
                <Checkbox value="1" style={{ lineHeight: "32px" }}>
                  1 Star
                </Checkbox>
              </Col>
              <Col span={8}>
                <Checkbox value="2" style={{ lineHeight: "32px" }}>
                  2 Star
                </Checkbox>
              </Col>
              <Col span={8}>
                <Checkbox value="3" style={{ lineHeight: "32px" }}>
                  3 Star
                </Checkbox>
              </Col>
              <Col span={8}>
                <Checkbox value="4" style={{ lineHeight: "32px" }}>
                  4 Star
                </Checkbox>
              </Col>
              <Col span={8}>
                <Checkbox value="5" style={{ lineHeight: "32px" }}>
                  5 Star
                </Checkbox>
              </Col>
            </Row>
          </Checkbox.Group>
        </Form.Item>
        <Form.Item
          label="Property Distances"
          name="distances"
          labelCol={{ span: 24 }}
          wrapperCol={{ span: 24 }}
        >
          <Slider
            range
            tooltip={{ open: true }}
            defaultValue={[0, 10]}
            min={0}
            max={10}
            onChange={(event) => onValueChange("distances", event)}
          />
        </Form.Item>
        <Form.Item
          label="Special Facilities"
          name="spec_facility"
          labelCol={{ span: 24 }}
          wrapperCol={{ span: 24 }}
        >
          <Checkbox.Group
            onChange={(event) => onValueChange("spec_facility", event)}
          >
            <Row>
              <Col span={24}>
                <Checkbox value="wheelchair" style={{ lineHeight: "32px" }}>
                  Wheelchair Accessibility
                </Checkbox>
              </Col>
              <Col span={24}>
                <Checkbox value="pets" style={{ lineHeight: "32px" }}>
                  Pets Allowed
                </Checkbox>
              </Col>
              <Col span={24}>
                <Checkbox value="family" style={{ lineHeight: "32px" }}>
                  Familiy Friendly
                </Checkbox>
              </Col>
              <Col span={24}>
                <Checkbox value="business" style={{ lineHeight: "32px" }}>
                  Business Facilities
                </Checkbox>
              </Col>
            </Row>
          </Checkbox.Group>
        </Form.Item>
        <Form.Item
          label="Property Facilities"
          name="facility"
          labelCol={{ span: 24 }}
          wrapperCol={{ span: 24 }}
        >
          <Checkbox.Group
            onChange={(event) => onValueChange("facility", event)}
          >
            <Row>
              <Col span={24}>
                <Checkbox value="restaurant" style={{ lineHeight: "32px" }}>
                  Restaurant or Bar
                </Checkbox>
              </Col>
              <Col span={24}>
                <Checkbox value="swimmingPool" style={{ lineHeight: "32px" }}>
                  Swimming Pool
                </Checkbox>
              </Col>
              <Col span={24}>
                <Checkbox value="spa" style={{ lineHeight: "32px" }}>
                  Spa or Sauna
                </Checkbox>
              </Col>
              <Col span={24}>
                <Checkbox value="gym" style={{ lineHeight: "32px" }}>
                  Gym Facility
                </Checkbox>
              </Col>
              <Col span={24}>
                <Checkbox value="frontDesk" style={{ lineHeight: "32px" }}>
                  Front Desk [24 hours]
                </Checkbox>
              </Col>
              <Col span={12} centered>
                <br />
                <Button type="primary" htmlType="submit" onClick={filterSubmit}>
                  Search
                </Button>
              </Col>
            </Row>
          </Checkbox.Group>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default Filters;
