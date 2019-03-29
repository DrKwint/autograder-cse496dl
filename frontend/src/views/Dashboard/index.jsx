import React from "react";
import {
    Table,
    Card,
    CardHeader,
    CardBody,
    CardTitle,
    Row,
    Col
} from "reactstrap";
import { Line } from "react-chartjs-2";
import randomColor from 'randomcolor';
import TeamCardClassification from 'components/TeamCardClassification';
import TeamCardReward from 'components/TeamCardReward';

const latestScore = (team) => team.test_steps.length ? team.test_steps[team.test_steps.length - 1].y : 0;

class Dashboard extends React.Component {
    componentDidMount() {
        this.props.fetchScoreData();
    }
    render() {
        const colors = randomColor({count: this.props.scoreData.size});
        const twoDaysAgo = new Date();
        twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);
        const sortedTeams = this.props.scoreData.toJS()
              .sort((team1, team2) => latestScore(team2) - latestScore(team1))
              .map(team => ({name: team.name, score: latestScore(team)}));

        let team_data;
        if (this.props.dataType === "classification") {
            team_data = this.props.scoreData.toJS().map(team => <TeamCardClassification team={team} key={`team-${team.name}`}/>);
        } else if (this.props.dataType === "value") {
            team_data = this.props.scoreData.toJS().map(team => <TeamCardReward team={team} key={`team-${team.name}`}/>);
        }

        let stepToPoint;
        let yAxisType;
        if (this.props.dataType === 'classification') {
            stepToPoint = step => ({x: step.x, y: 1 - step.y});
            yAxisType = 'logarithmic';
        } else if (this.props.dataType === 'value') {
            stepToPoint = step => ({x: step.x, y: step.y});
            yAxisType = 'linear';
        }

        const comparison = (
            <Line
              data={{
                  datasets: this.props.scoreData.toJS()
                      .map((team, i) => ({
                          label: team.name,
                          data: team.test_steps.map(stepToPoint) ,
                          fill: false,
                          borderColor: colors[i],
                          backgroundColor: "transparent",
                      }))
              }}
              options={{
                  legend: {
                      display: false,
                  },
                  scales: {
                      xAxes: [{
                          type: 'time',
                          time: {
                              unit: 'day',
                              min: twoDaysAgo,
                          },
                      }],
                      yAxes: [{
                          type: yAxisType,
                          ticks: {
                              beginAtZero: true,
                          }
                      }],
                  }
              }}
              width={400}
              height={100}
            />);


        return (
            <div className="content">
              <Row>
                <Col xs={12} xl={8} id="class-comparison">
                  <Card>
                    <CardHeader>
                      <CardTitle>Class Comparison (Error Rate)</CardTitle>
                    </CardHeader>
                    <CardBody>
                      {comparison}
                    </CardBody>
                  </Card>
                </Col>
                <Col xs={12} xl={4}>
                  <Card>
                    <CardBody>
                      <Table>
                        <thead>
                          <tr>
                            <th>Place</th>
                            <th>Team</th>
                            {this.props.dataType === "classification" ? (
                                <th>Accuracy</th>
                            ) : (
                                <th>Reward</th>
                            )}
                          </tr>
                        </thead>
                        <tbody>
                          {sortedTeams.slice(0,5)
                           .map((team, i) => (
                               <tr key={`ranking-${team.name}`}>
                                 <td>{i + 1}</td>
                                 <td>{team.name}</td>
                                 {this.props.dataType === "classification" ? (
                                     <td>{(team.score * 100).toFixed(2)}%</td>
                                 ) : (
                                     <td>{team.score.toFixed(2)}</td>
                                 )}
                               </tr>
                           ))}
                        </tbody>
                      </Table>
                    </CardBody>
                  </Card>
                </Col>
              </Row>
              {team_data}
            </div>
        );
    }
}

export default Dashboard;
