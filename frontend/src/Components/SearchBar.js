import React, { createContext, useState } from "react";
import {
  Form,
  Input,
  Select,
  InputNumber,
  Card,
  DatePicker,
  Button,
  Row,
  Col,
} from "antd";

import moment from "moment";
import axios from "axios";
import { FormContext } from "../Context/FormContext";
import { Link, useNavigate } from "react-router-dom";
function SearchBar() {
  const gridStyle = {
    width: "25%",
    textAlign: "center",
  };
  const { RangePicker } = DatePicker;
  const dateFormat = "DD/MM/YYYY";
  const [values, setValues] = useState([]);
  const [forms] = Form.useForm();

  const [formData, updateFormData] = useState(FormContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    updateFormData(name, value);
  };

  const handleSubmit = async () => {    
    try {
      await axios
        .post("http://localhost:5000/cariData", forms.getFieldsValue())
        .then(function (response) {
          setValues(response.data);
          navigate("/HotelList", { state: {data: response.data} });
        });
    } catch (error) {
      console.error("There was an error submitting the form!", error);
    }
  };

  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  return (
    <>
      <Card bordered={false} className="searchCard container">
        <br />
        <br />
        <br />
        <h5>--- Sebuah proyek tugas akhir ---</h5>
        <br />
        <h3>
          Explore, compare, and book <br /> your dream accommodations with ease{" "}
          <br /> with recoco
        </h3>
        <br />
        <br />
        <Form
          layout="vertical"
          form={forms}
          initialValues={{
            range_picker: [
              moment("01/01/2022", dateFormat),
              moment("02/03/2022", dateFormat),
            ],
          }}
          onFinish={handleSubmit}
          onFinishFailed={onFinishFailed}
        >
          <Card bordered={false} className="cardContainer">
            <Card.Grid style={gridStyle}>
              {/* kayanya ini pake select aja deh */}
              <Form.Item
                label="Location"
                name="location"
                rules={[{ required: true, message: "Locations is required" }]}
              >
                <Input />
              </Form.Item>
            </Card.Grid>
            <Card.Grid style={gridStyle}>
              <Form.Item
                label="Date"
                name="tgl_masuk"
                rules={[
                  { required: true, message: "Check-in/out date is required" },
                ]}
              >
                <RangePicker format={dateFormat} />
              </Form.Item>
            </Card.Grid>
            <Card.Grid style={gridStyle}>
              <Form.Item label="Preferences" name="tujuan">
                <Select
                  defaultValue="0"
                  options={[
                    { value: "0", label: "Preferences" },
                    { value: "nature", label: "Nature" },
                    { value: "medical", label: "Medical" },
                    { value: "religi", label: "Religi" },
                    { value: "transit", label: "Transit" },
                    { value: "shopping", label: "Shopping" },
                    { value: "historical", label: "Historical" },
                    { value: "education_trip", label: "Education Trip" },
                  ]}
                />
              </Form.Item>
            </Card.Grid>
            <Card.Grid style={gridStyle}>
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item label="Rooms" name="tamu">
                    <InputNumber defaultValue={1} />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <br />
                  <Button
                    type="primary"
                    htmlType="submit"
                  >
                    Search
                  </Button>
                </Col>
              </Row>
            </Card.Grid>
          </Card>
        </Form>
      </Card>
    </>
  );
}
export default SearchBar;
