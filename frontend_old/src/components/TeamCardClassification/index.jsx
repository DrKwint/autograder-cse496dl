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
import ConfusionMatrix from "components/ConfusionMatrix";

const TeamCardClassification = (props) => {
    const twoDaysAgo = new Date();
    twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);
    return (
        <Row key={`team-${props.team.name}`} id={`team-${props.team.name}`}>
          <Col xs={12}>
            <Card className="card-chart">
              <CardHeader>
                <CardTitle>{props.team.name}</CardTitle>
              </CardHeader>
              <CardBody>
                <Row>
                  <Col xs={12} md={6}>
                    <Line
                      data={{
                          datasets: [{
                              label: `${props.team.name} Training Accuracy`,
                              data: props.team.train_steps,
                              fill: false,
                              borderColor: "#fbc658",
                              backgroundColor: "transparent",
                              pointBorderColor: "#fbc658",
                              pointRadius: 4,
                              pointHoverRadius: 4,
                          }, {
                              label: `${props.team.name} Testing Accuracy`,
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
                  <Col xs={6} md={3}>
                    <p style={{textAlign: "center"}}>Training Confusion Matrix</p>
                    <ConfusionMatrix matrix={props.team.train_matrix} mkey={`${props.team.name}-train`} blockgap={0} />
                  </Col>
                  <Col xs={6} md={3}>
                    <p style={{textAlign: "center"}}>Testing Confusion Matrix</p>
                    <ConfusionMatrix matrix={props.team.test_matrix} mkey={`${props.team.name}-test`} blockgap={0}/>
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
}

export default TeamCardClassification;
