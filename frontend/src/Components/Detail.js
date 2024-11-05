import { Card, Col, Image, List, Row, Typography } from "antd";
import { Fragment } from "react";
import { useLocation } from "react-router-dom";
import { StarFilled } from "@ant-design/icons";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "antd/dist/reset.css";
import L from "leaflet";
import iconImg from "../../node_modules/leaflet/src/images/marker.svg";

function DetailHotel() {
  const location = useLocation();
  const jsonString = JSON.stringify(location.state.detailHotel);
  const formData = JSON.parse(jsonString);
  const jsonPrice = JSON.stringify(location.state.detailPrice);
  const formDataPrice = JSON.parse(jsonPrice);
  const { Text } = Typography;

  const position = [
    formData?.data?.location?.coordinates?.latitude,
    formData?.data?.location?.coordinates?.longitude,
  ];

  const customIcon = new L.Icon({
    iconUrl: iconImg,
    iconSize: [25, 41], // Size of the icon
    iconAnchor: [12, 41], // Point of the icon which will correspond to marker's location
    popupAnchor: [1, -34], // Point from which the popup should open relative to the iconAnchor
    shadowUrl:
      "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.4/images/marker-shadow.png",
    shadowSize: [41, 41],
  });

  const goToDetail = async (event, e) => {
    event.preventDefault();    
  };

  return (
    <Fragment>
      <Row gutter={[10, 14]}>
        <Col span={10}>
          <Card bordered={false}>
            <Image src={formData?.data?.goodToKnow?.description?.image} />
            <Col span={24}>
              <Row className="scrollable-img">
                <Col>
                  <br />
                  {formData?.data?.gallery?.images.map((data, index) => (
                    <Image src={data?.gallery} key={index} width={200} />
                  ))}
                </Col>
              </Row>
            </Col>
            <br />
            <Card
              bordered={false}
              style={{ width: "100%" }}
              title={formData?.data?.location?.shortAddress}
            >
              <MapContainer
                center={position}
                zoom={17}
                style={{ height: "400px", width: "100%" }}
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                <Marker position={position} icon={customIcon}>
                  <Popup>{formData?.data?.general?.name}</Popup>
                </Marker>
              </MapContainer>
            </Card>
          </Card>
        </Col>
        <Col span={14}>
          <Card title={formData?.data?.general?.name} bordered={false}>
            <Text style={{ fontWeight: "bold", fontStyle: "italic" }}>
              "{formData?.data?.goodToKnow?.description?.content}"
            </Text>
            <br />
            <br />
            <Card bordered={false} title="Hotel Rates">
              <Row>
                {formDataPrice?.data?.otaRates.map((data, index) => (
                  <Card
                    bordered={false}
                    title={data?.name}
                    cover={
                      <img
                        src={data?.partnerLogo}
                        alt="hotels"
                        style={{ width: "120px" }}
                      />
                    }
                    onClick={(event) => goToDetail(event, data?.hotelId)}
                  >
                    <Text>
                      {data?.partnerName} - {data?.price}
                    </Text>
                    <br />
                    <Text>{data?.roomPolicies}</Text>
                  </Card>
                ))}
              </Row>
            </Card>
            <br />
            <Card bordered={false} title="Hotel Reviews">
              <Row>
                <Col span={12} style={{ fontWeight: "bold" }}>
                  <StarFilled style={{ color: "yellow" }} />{" "}
                  {formData?.data?.reviewRatingSummary?.score} -{" "}
                  {formData?.data?.reviewRatingSummary?.scoreDesc}
                </Col>
                <Col
                  span={12}
                  style={{ fontWeight: "bold", textAlign: "right" }}
                >
                  {formData?.data?.reviewRatingSummary?.count}
                </Col>
              </Row>
              <br />
              <Row>
                {formData?.data?.reviewRatingSummary?.categories.map(
                  (data, index) => (
                    <Card bordered={false} title={data?.name}>
                      <StarFilled /> {data?.score} - {data?.description}
                    </Card>
                  )
                )}
              </Row>
            </Card>
            <br />
            <Card bordered={false} title="Hotel Facilities">
              <Row>
                {formData?.data?.amenities?.contentV2.map((data, index) => (
                  <>
                    {data?.id === "InTheRooms" && (
                      <Col span={8}>
                        <Text style={{ fontWeight: "bold" }}>
                          Room Facilities
                        </Text>
                        {data?.items.map((data, index) => (
                          <List.Item>
                            <Text>{data?.description}</Text>
                          </List.Item>
                        ))}
                      </Col>
                    )}
                    {data?.id === "HealthcareAndAccessibility" && (
                      <Col span={8}>
                        <Text style={{ fontWeight: "bold" }}>
                          Health Accessibility
                        </Text>
                        {data?.items.map((data, index) => (
                          <List.Item>
                            <Text>{data?.description}</Text>
                          </List.Item>
                        ))}
                      </Col>
                    )}
                    {data?.id === "Services" && (
                      <Col span={8}>
                        <Text style={{ fontWeight: "bold" }}>
                          Hotel Service
                        </Text>
                        {data?.items.map((data, index) => (
                          <List.Item>
                            <Text>{data?.description}</Text>
                          </List.Item>
                        ))}
                      </Col>
                    )}
                    {data?.id === "HotelAndOutdoorFacilities" && (
                      <Col span={8}>
                        <Text style={{ fontWeight: "bold" }}>
                          Hotel Outdoor Facilities
                        </Text>
                        {data?.items.map((data, index) => (
                          <List.Item>
                            <Text>{data?.description}</Text>
                          </List.Item>
                        ))}
                      </Col>
                    )}
                    {data?.id === "TransportAndParking" && (
                      <Col span={8}>
                        <Text style={{ fontWeight: "bold" }}>
                          Transport and Parking
                        </Text>
                        {data?.items.map((data, index) => (
                          <List.Item>
                            <Text>{data?.description}</Text>
                          </List.Item>
                        ))}
                      </Col>
                    )}
                  </>
                ))}
              </Row>
            </Card>
            <Card bordered={false} title="Hotel Policies">
              <Row>
                <Col span={12}>
                  <Text>
                    {formData?.data?.goodToKnow?.checkinTime?.title}:{" "}
                    {formData?.data?.goodToKnow?.checkinTime?.time}
                  </Text>
                </Col>
                <Col span={12}>
                  <Text>
                    {formData?.data?.goodToKnow?.checkoutTime?.title}:{" "}
                    {formData?.data?.goodToKnow?.checkoutTime?.time}
                  </Text>
                </Col>
              </Row>
            </Card>
          </Card>
        </Col>
      </Row>
    </Fragment>
  );
}
export default DetailHotel;
