import { useLocation, useNavigate } from "react-router-dom";
import React, { useState } from "react";
import { Button, Checkbox, Col, Form, Row, Slider } from "antd";
import { StarFilled } from "@ant-design/icons";
import Grid from "antd/es/card/Grid";
import Card from "antd/es/card/Card";
import Meta from "antd/es/card/Meta";
import axios from "axios";

function HotelList() {
  const location = useLocation();
  const jsonString = JSON.stringify(location.state?.data);
  const formData = JSON.parse(jsonString);
  console.log(formData);
  const [form] = Form.useForm();
  const [filterData, setFilterData] = useState(formData);
  const navigate = useNavigate();
  const initialValue = {
    prices: [100000, 5000000],
    spec_facility: "",
    facility: "",
    distances: [0, 10],
  };
  const [customPayload, setCustomPayload] = useState(initialValue);

  const onValueChange = (key, value) => {
    setCustomPayload((prevState) => ({
      ...prevState,
      [key]: value,
    }));
  };

  function arrayContainsAnySubstring(arr, substrings) {
    if (!Array.isArray(arr) || !Array.isArray(substrings)) {
      throw new TypeError("Both arguments should be arrays");
    }

    // Return an empty array if either array is empty
    if (arr.length === 0 || substrings.length === 0) {
      return [];
    }
    const filterd = arr.some((sentence) =>
      substrings.some((substring) =>
        sentence.toLowerCase().includes(substring.toLowerCase())
      )
    );
    return filterd;
  }

  const filterSubmit = () => {
    console.log(form.getFieldsValue())
    // let filtered = filterData.filter(
    //   (filters) =>
    //     filters.hotelPrice >= customPayload["prices"][0] &&
    //     filters.hotelPrice <= customPayload["prices"][1] &&
    //     filters.distances >= customPayload["distances"][0] &&
    //     filters.distances <= customPayload["distances"][1]
    // );
    // if (customPayload["facility"].length > 0) {
    //   filtered = filtered.filter((filters) =>
    //     arrayContainsAnySubstring(
    //       JSON.parse(
    //         filters.fasilitas.replace(/'/g, '"').replace(/\\x96/g, "-")
    //       ),
    //       customPayload["facility"]
    //     )
    //   );
    // }
    // if (customPayload["spec_facility"].length > 0) {
    //   filtered = filtered.filter((filters) =>
    //     arrayContainsAnySubstring(
    //       JSON.parse(
    //         filters.fasilitas.replace(/'/g, '"').replace(/\\x96/g, "-")
    //       ),
    //       customPayload["spec_facility"]
    //     )
    //   );
    // }
    // setFilterData(filtered);
  };
  const resetFilter = () => {
    setFilterData(formData);
  };

  const goToDetail = async (event, e) => {
    event.preventDefault();
    try {
      const detailHotel = await axios.get("http://localhost:5000/detail", {
        params: { hotelId: e },
      });
      const hotelPrice = await axios.get("http://localhost:5000/detailPrice", {
        params: { hotelId: e },
      });
      navigate("/DetailHotel", {
        state: { detailHotel: detailHotel.data, detailPrice: hotelPrice.data },
      });
    } catch (error) {
      console.error("There was an error submitting the form!", error);
    }
  };

  const RatingComponent = ({ rating, totalStars = 5 }) => {
    // Loop through the number of stars based on the rating
    const stars = [];
    for (let i = 0; i < rating; i++) {
      stars.push(<StarFilled key={i} style={{ color: "#FFD700" }} />); // Add filled stars
    }

    // Optionally add empty stars if you want to show the full set (e.g., 5 stars total)
    for (let i = rating; i < totalStars; i++) {
      stars.push(<StarFilled key={i} style={{ color: "#D3D3D3" }} />); // You can use a different color for empty stars
    }

    return <div>{stars}</div>;
  };

  const formatNumber = (value) => {
    const formatter = new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
    });    
    return formatter.format(value);  // Format as currency (e.g., $20.00)
  };

  return (
    <Row gutter={[8, 24]}>
      <Col span={8}>
        {" "}
        {/* container for filter */}
        <Card bordered={false}>
          <br />
          <Form labelWrap wrapperCol={{ flex: 1 }} style={{ margin: 10 }} form={form}>
            {customPayload !== null && (
              <Button type="secondary" onClick={resetFilter}>
                Reset Filter
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
                defaultValue={[100000, 200000]}
                tooltip={{ open: true, formatter: formatNumber }}
                min={0}
                max={2500000}
                onChange={(event) => onValueChange("prices", event)}
              />
            </Form.Item>
            <Form.Item
              label="Property Rating"
              name="ratings"
              labelCol={{ span: 24 }}
              wrapperCol={{ span: 24 }}
            >
              <Checkbox.Group
                onChange={(event) => onValueChange("ratings", event)}
              >
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
                    <Checkbox
                      value="restaurants"
                      style={{ lineHeight: "32px" }}
                    >
                      Restaurant or Bar
                    </Checkbox>
                  </Col>
                  <Col span={24}>
                    <Checkbox value="pool" style={{ lineHeight: "32px" }}>
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
                    <Checkbox value="front desk" style={{ lineHeight: "32px" }}>
                      Front Desk [24 hours]
                    </Checkbox>
                  </Col>
                </Row>
              </Checkbox.Group>
            </Form.Item>
            <Form.Item
              label="Room Facilities"
              name="facility"
              labelCol={{ span: 24 }}
              wrapperCol={{ span: 24 }}
            >
              <Checkbox.Group
                onChange={(event) => onValueChange("facility", event)}
              >
                <Row>
                  <Col span={24}>
                    <Checkbox value="breakfast" style={{ lineHeight: "32px" }}>
                      Breakfast Included
                    </Checkbox>
                  </Col>
                  <Col span={24}>
                    <Checkbox value="internet" style={{ lineHeight: "32px" }}>
                      Wifi or Internet
                    </Checkbox>
                  </Col>
                  <Col span={24}>
                    <Checkbox value="closet" style={{ lineHeight: "32px" }}>
                      Closet
                    </Checkbox>
                  </Col>
                  <Col span={24}>
                    <Checkbox
                      value="deposit_box"
                      style={{ lineHeight: "32px" }}
                    >
                      Safety Deposit Box
                    </Checkbox>
                  </Col>
                  <Col span={24}>
                    <Checkbox value="laundry" style={{ lineHeight: "32px" }}>
                      Laundry Facilities
                    </Checkbox>
                  </Col>
                  <Col span={12} centered>
                    <br />
                    <Button
                      type="primary"
                      htmlType="submit"
                      onClick={filterSubmit}
                    >
                      Search
                    </Button>
                  </Col>
                </Row>
              </Checkbox.Group>
            </Form.Item>
          </Form>
        </Card>
      </Col>
      <Col span={16}>
        {" "}
        {/* container for hotel cards */}
        <Grid style={{ margin: "9px" }}>
          <Row gutter={[16, 16]}>
            {filterData.map((data, index) => {
              return (
                <Col span={6} key={index}>
                  {console.log(data?.hotelId)}
                  <Card
                    bordered={false}
                    className="hotelsCard"
                    cover={
                      <img
                        src={data?.heroImage}
                        alt="hotels"
                        style={{ height: "200px" }}
                      />
                    }
                    onClick={(event) => goToDetail(event, data?.hotelId)}
                  >
                    <Meta
                      title={data?.name}
                      description={
                        <>
                          <h5>{data?.distance}</h5>
                          <p style={{ fontWeight: "bold", color: "red" }}>
                            <Row gutter={[8, 8]}>
                              <Col span={16}>{data?.price}</Col>
                              <Col span={8}>
                                <RatingComponent
                                  rating={data?.stars}
                                  totalStars={5}
                                />
                              </Col>
                            </Row>
                          </p>
                          <p>
                            Near To:
                            <Row gutter={[5, 5, 5, 5, 5, 5, 5]}>
                              {data?.isNature === 1 && (
                                <Col>
                                  <Button
                                    style={{
                                      backgroundColor: "#32CD32",
                                      borderColor: "#32CD32",
                                      color: "#fff",
                                    }}
                                  >
                                    Nature
                                  </Button>
                                </Col>
                              )}
                              {data?.isEducation === 1 && (
                                <Col>
                                  <Button
                                    style={{
                                      backgroundColor: "#3B82F6",
                                      borderColor: "#3B82F6",
                                      color: "#fff",
                                    }}
                                  >
                                    Education
                                  </Button>
                                </Col>
                              )}
                              {data?.isShopping === 1 && (
                                <Col>
                                  <Button
                                    style={{
                                      backgroundColor: "#D32F2F ",
                                      borderColor: "#D32F2F ",
                                      color: "#fff",
                                    }}
                                  >
                                    Shopping
                                  </Button>
                                </Col>
                              )}
                              {data?.isReligi === 1 && (
                                <Col>
                                  <Button
                                    style={{
                                      backgroundColor: "#9C27B0",
                                      borderColor: "#9C27B0",
                                      color: "#fff",
                                    }}
                                  >
                                    Place to Worship
                                  </Button>
                                </Col>
                              )}
                              {data?.isTransit === 1 && (
                                <Col>
                                  <Button
                                    style={{
                                      backgroundColor: "#FFEB3B",
                                      borderColor: "#FFEB3B",
                                      color: "#000",
                                    }}
                                  >
                                    Transport Access
                                  </Button>
                                </Col>
                              )}
                            </Row>
                          </p>
                        </>
                      }
                    />
                  </Card>
                </Col>
              );
            })}
          </Row>
        </Grid>
      </Col>
    </Row>
  );
}

export default HotelList;
