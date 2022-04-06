import { useState, useEffect } from 'react';
import './App.css';
import { FaPlus, FaTimes } from 'react-icons/fa';

import { Button, Form, Table, Row, Col, InputGroup } from "react-bootstrap";

import Axios from 'axios';
import { getCurrentUser } from './services/auth.service';

let changedIndexes = {};

function GradePage() {
  const courseID = new URLSearchParams(window.location.search).get("course");

  const [studentsSelect, setStudentsSelect] = useState({});
  const [courseStudents, setCourseStudents] = useState([]);
  const [studentToBeAdded, setStudentToBeAdded] = useState("");
  const [newAssignment, setNewAssignment] = useState("");
  const [assignments, setAssignments] = useState([]);
  const [assignmentStats, setAssignmentStats] = useState([]);

  const [rows, setRows] = useState({});
  const [assignedCourses, setAssignedCourses] = useState({});
  const [update, setUpdate] = useState(false);

  const [editVisibilityIndex, setEditVisibilityIndex] = useState(-1);

  let avgCount = 0;
  let avgOfAvgs = 0;

  const saveRows = () => {
    Object.keys(changedIndexes).forEach(username => {
      changedIndexes[username].forEach(assignmentID => {
        Axios.post("http://localhost:8000/api/grade/update",
          { username: username, assignmentID: assignmentID, courseID: courseID, id: rows[username][assignmentID]["gradeID"], studentGrade: rows[username][assignmentID]["studentGrade"] })
          .then((response) => {
            if (response.data === "") {
              return;
            }
            changedIndexes = {};
            setUpdate(!update);
          });
      });
    });

    Axios.post("http://localhost:8000/api/grade/update", {})

      .then((response) => {
        if (response.data === "") {
          return;
        }
        setUpdate(!update);
      });
  }

  const addStudentToCourse = () => {
    Axios.post("http://localhost:8000/api/student_course/create/", { courseID: courseID, studentID: studentToBeAdded })
      .then((response) => {
        setUpdate(!update);
      });
  }

  const removeStudentFromCourse = (username) => {
    Axios.post("http://localhost:8000/api/student_course/delete/", { courseID: courseID, studentID: username })
      .then((response) => {
        Axios.post("http://localhost:8000/api/grade/delete/", { courseID: courseID, username: username, action: "clearStudent" })
          .then((response) => {
            setUpdate(!update);
          });
      });
  }

  const addAssignmentToCourse = () => {
    Axios.post("http://localhost:8000/api/assignment/create/", { courseID: courseID, assignmentName: newAssignment })
      .then((response) => {
        setUpdate(!update);
      });
  }

  const removeAssignmentFromCourse = (assignmentID) => {
    Axios.post("http://localhost:8000/api/assignment/delete/", { id: assignmentID })
      .then((response) => {
        Axios.post("http://localhost:8000/api/grade/delete/", { courseID: courseID, assignmentID: assignmentID, action: "clearAssignment" })
          .then((response) => {
            setUpdate(!update);
          });
      });
  }


  useEffect(() => {
    if (getCurrentUser() && getCurrentUser().role === "Öğretmen") {
      Axios.get("http://localhost:8000/api/course?instructor=" + getCurrentUser()["username"])
        .then((response) => {
          let tempAssignedCourses = {};
          response.data.forEach(course => {
            tempAssignedCourses[course.id] = course;
          });
          setAssignedCourses(tempAssignedCourses);
        });
    }


    Axios.get("http://localhost:8000/api/student")
      .then((response) => {
        let tempStudents = {}

        response.data.forEach((e) => {
          tempStudents[e.username] = e;
        })
        setStudentsSelect(tempStudents);
        Axios.get("http://localhost:8000/api/student_course?course=" + courseID)
          .then((studentCourseResponse) => {
            setCourseStudents(studentCourseResponse.data.map((e) => { return e.studentID }));
            Axios.get("http://localhost:8000/api/assignment?course=" + courseID)
              .then((assignmentResponse) => {
                let tempRows = {};
                studentCourseResponse.data.forEach(courseStudent => {
                  tempRows[courseStudent["studentID"]] = {};
                  assignmentResponse.data.forEach(assignment => {
                    tempRows[courseStudent["studentID"]][assignment.id] = { gradeID: "-1", studentGrade: "0" };
                  });
                });
                Axios.get("http://localhost:8000/api/grade?course=" + courseID)
                  .then((gradeResponse) => {
                    gradeResponse.data.forEach(element => {
                      if (tempRows[element.username] !== undefined) {
                        tempRows[element.username][element.assignmentID] = { gradeID: element.id, studentGrade: element.studentGrade };
                      }
                    });
                    setRows(tempRows);
                    setAssignments(assignmentResponse.data);
                    let tempAssignmentStats = {};
                    assignmentResponse.data.forEach(assignment => {
                      tempAssignmentStats[assignment.id] = false;
                    });
                    setAssignmentStats(tempAssignmentStats);

                  });
              });
          });
      });


  }, [update, courseID]);

  if (!getCurrentUser() || getCurrentUser().role !== "Öğretmen" || !Object.keys(assignedCourses).includes(courseID)) {
    return <></>;
  }


  return (
    <div className="App">
      <Row>
        <Col></Col>
        <Col><h3> Not </h3></Col>
        <Col>
          <div style={{ display: "flex" }}>
            <InputGroup className="float-end mt-1 mb-1" style={{ width: "100%", marginRight: "5px" }}>
              <Form.Control size="sm" type="text" value={newAssignment} onChange={(e) => {
                setNewAssignment(e.target.value);
              }} />
              <Button className="ml-2 ml-5 mt-0" size="sm" variant="dark" onClick={() => {
                if (newAssignment.length > 0) {
                  addAssignmentToCourse();
                  setNewAssignment("");
                }
              }}>Aktivite Ekle</Button>
            </InputGroup>
            <Button className="float-end mt-1 me-4 mb-1" size="sm" variant="dark" onClick={() => {
              saveRows();
            }}>Kaydet</Button>
          </div>

        </Col>
      </Row>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th style={{ width: "4%" }}>#</th>
            <th>Okul No</th>
            <th>Ad Soyad</th>
            {assignments.map((assignment, index) => {
              return <th key={index} style={{ whiteSpace: "nowrap" }}>
                <div style={{ display: "flex", justifyContent: "center" }}>
                  {assignment["assignmentName"]}
                  <Form.Check
                    type="switch"
                    checked={assignmentStats[assignment["id"]] ?? false}
                    onChange={(e) => {
                      let tempAssignmentStats = { ...assignmentStats };
                      tempAssignmentStats[assignment["id"]] = !tempAssignmentStats[assignment["id"]];
                      setAssignmentStats(tempAssignmentStats);
                    }
                    }
                  />
                  <FaTimes onClick={() => { removeAssignmentFromCourse(assignment["id"]); }} style={{ color: "red", marginTop: "5px" }} />
                </div>
              </th>
            })}
            <th>Ortalama</th>
          </tr>
        </thead>
        <tbody>
          {Object.keys(rows).map((username, index) => {
            let avg = 0;
            let assignmentCount = 0;
            for (const i in assignments) {
              let assignmentID = assignments[i]["id"];
              if (rows[username] !== undefined && rows[username][assignmentID] !== undefined && rows[username][assignmentID]["studentGrade"] > 0) {
                avg += parseInt(rows[username][assignmentID]["studentGrade"]);
                assignmentCount++;
              }
            }
            if (assignmentCount > 0) {
              avg = Math.round(avg / assignmentCount);
            }
            avgOfAvgs += avg;
            if (avg > 0) {
              avgCount++;
            }

            return <tr key={index}
              onMouseEnter={() => { setEditVisibilityIndex(index); }}
              onMouseLeave={() => { setEditVisibilityIndex(-1); }}>
              <td>{editVisibilityIndex === index ? <FaTimes onClick={() => { removeStudentFromCourse(username); }} style={{ color: "red" }} /> : index + 1}</td>
              <td>{username}</td>
              <td style={{ whiteSpace: "nowrap" }}>{studentsSelect[username]["name"] + " " + studentsSelect[username]["lastname"]}</td>
              {assignments.map((element) => { return element["id"] }).map((assignmentID) => {
                return assignmentStats[assignmentID] ? <td key={assignmentID} ><Form.Control size="sm" type="number" min="0" max="100" value={rows[username] !== undefined && rows[username][assignmentID] !== undefined && rows[username][assignmentID]["studentGrade"]} onChange={(e) => {
                  if (e.target.value.length < 4) {
                    let tempRows = { ...rows };
                    if (!(assignmentID in tempRows[username])) {
                      tempRows[username][assignmentID] = { gradeID: "0", studentGrade: "" };
                    }
                    tempRows[username][assignmentID]["studentGrade"] = e.target.value;
                    setRows(tempRows);
                    if (!(username in changedIndexes)) {
                      changedIndexes[username] = [];
                    }
                    if (!changedIndexes[username].includes(assignmentID)) {
                      changedIndexes[username].push(assignmentID);
                    }
                  }
                }} /></td> : <td key={assignmentID + "_text"}>{rows[username] !== undefined && rows[username][assignmentID] !== undefined && rows[username][assignmentID]["studentGrade"]}</td>
              })}
              <td>{avg}</td>
            </tr>
          })}
          <tr key="newStudent">
            <td> <FaPlus /> </td>
            <td>
              <div style={{ display: "flex" }}>
                <InputGroup style={{ width: "100%", marginRight: "5px" }}>
                  <Form.Select value={studentToBeAdded} onChange={(e) => {
                    setStudentToBeAdded(e.target.value);
                  }} required>
                    <option value="" disabled>Seçiniz...</option>
                    {Object.keys(studentsSelect).map((username, index) => {
                      return !courseStudents.includes(username) && <option key={index} value={username} >{username + ": " + studentsSelect[username]["name"] + " " + studentsSelect[username]["lastname"]}</option>
                    })}
                  </Form.Select>
                  <Button className="ml-2 ml-5 mt-0" size="sm" variant="dark" onClick={() => {
                    addStudentToCourse();
                    setStudentToBeAdded("");
                  }}>Ekle</Button>
                </InputGroup>
              </div>
            </td>
          </tr>
          <tr key={"overall_avg"}>
            <td></td>
            <td></td>
            <td><strong>Ortalama</strong></td>
            {assignments.map((element) => { return element["id"] }).map((assignmentID) => {
              let avg = 0;
              let studentCount = 0;
              for (const i in courseStudents) {
                const username = courseStudents[i];
                if (rows[username] !== undefined && rows[username][assignmentID] !== undefined && rows[username][assignmentID]["studentGrade"] > 0) {
                  avg += parseInt(rows[username][assignmentID]["studentGrade"]);
                  studentCount++;
                }
              }
              if (studentCount > 0) {
                avg = Math.round(avg / studentCount);
              }
              return <td key={assignmentID + "_overall_text"}><strong>{avg}</strong></td>
            })}
            <td><strong> {
              Math.round(avgOfAvgs / (avgCount <= 0 ? 1 : avgCount))}</strong></td>
            {/* <td><strong> {
            Math.round(Object.keys(rows).map((username, index) => {
              let avg = 0;
              let assignmentCount = 0;
              for (const i in assignments) {
                let assignmentID = assignments[i]["id"];
                if (rows[username] !== undefined && rows[username][assignmentID] !== undefined && rows[username][assignmentID]["studentGrade"] > 0) {
                  avg += parseInt(rows[username][assignmentID]["studentGrade"]);
                  assignmentCount++;
                }
              }
              if (assignmentCount > 0) {
                avg = avg / assignmentCount;
              }

              return avg;
            }).reduce(function(acc, val) { return acc + val; }, 0) / Object.keys(rows).length)}</strong></td> */}
            {/* <td>{avg}</td> */}
          </tr>

        </tbody>
      </Table>
    </div>
  );
}

export default GradePage;
