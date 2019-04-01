import React from 'react';
import {
    Card,
    CardHeader,
    CardBody,
    CardTitle,
    Row,
    Col
} from "reactstrap";
import { Line } from "react-chartjs-2";

const TeamCardReward = (props) => {
    const twoDaysAgo = new Date();
    twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);
    return (
        <Row id={`team-${props.team.name}`}>
          <Col xs={12}>
            <Card className="card-chart">
              <CardHeader>
                <CardTitle>{props.team.name}</CardTitle>
              </CardHeader>
              <CardBody>
                <Row>
                  <Col xs={12}>
                    <Line
                      data={{
                          datasets: [{
                              label: `${props.team.name} Reward`,
                              data: props.team.test_steps,
                              fill: true,
                              borderColor: "#51CACF",
                              backgroundColor: "transparent",
                              pointBorderColor: "#51CACF",
                              pointRadius: 4,
                              pointHoverRadius: 4,
                          }]
                      }}
                      options={{
                          display: false,
                          position: "top",
                          scales: {
                              xAxes: [{
                                  type: 'time',
                                  time: {
                                      unit: 'day',
                                      min: twoDaysAgo,
                                  },
                              }],
                              yAxes: [{
                                  ticks: {
                                      beginAtZero: true,
                                  }
                              }]
                          }
                      }}
                      width={400}
                      height={200}
                    />
                  </Col>
                  {props.team.meta_data.error ? (
                      <Col xs={12}>
                        Error: {props.team.meta_data.error}
                      </Col>
                  ) : null}
                </Row>
              </CardBody>
            </Card>
          </Col>
        </Row>
    );
};

export default TeamCardReward;
