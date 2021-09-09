import React from "react";
import { acceptRequest, deleteRequest, fetchRequestList } from "../api/api";

interface RequestListProps {}

interface RequestListState {
  requests: RoomRequest[];
}

export class RequestList extends React.Component<
  RequestListProps,
  RequestListState
> {
  constructor(props: RequestListProps) {
    super(props);

    this.state = {
      requests: [],
    };
  }

  render(): JSX.Element {
    return (
      <ul
        style={{
          listStyle: "none",
          padding: "4px",
          boxSizing: "border-box",
          margin: "0px",
        }}
      >
        {this.state.requests.map((req) => {
          return (
            <li
              key={req.id}
              style={{
                display: "flex",
                flexDirection: "column",
                marginBottom: "8px",
              }}
            >
              <div
                style={{
                  marginBottom: "4px",
                }}
              >
                <p
                  style={{
                    margin: "0px",
                  }}
                >
                  {req.room.uuid?.split("-")[0]}
                </p>
                <p
                  style={{
                    margin: "0px",
                    fontSize: "10px",
                    color: "#666",
                  }}
                >
                  Via: <br />
                  {req.via}
                </p>
              </div>
              <div style={{ display: "flex", justifyContent: "space-evenly" }}>
                <button
                  style={{
                    color: "blueviolet",
                  }}
                  onClick={() => {
                    deleteRequest(req.id).then((res) => {
                      if (res.ok) this.removeRequest(req);
                    });
                  }}
                >
                  Ignore
                </button>
                <button
                  style={{
                    backgroundColor: "blueviolet",
                    borderRadius: "4px",
                    color: "#FFF",
                    width: "33%",
                  }}
                  onClick={() => {
                    acceptRequest(req.id).then((res) => {
                      if (res.ok) this.removeRequest(req);
                    });
                  }}
                >
                  Accept
                </button>
              </div>
            </li>
          );
        })}
      </ul>
    );
  }

  componentDidMount() {
    fetchRequestList()
      .then((res) => res.json())
      .then((response) => {
        if (response != null)
          this.setState({
            requests: response,
          });
      });
  }

  pushRequest(req: RoomRequest) {
    let list = this.state.requests;
    list.push(req);

    this.setState({
      requests: list,
    });
  }

  removeRequest(req: RoomRequest) {
    let list = this.state.requests;
    list.splice(list.indexOf(req), 1);

    this.setState({
      requests: list,
    });
  }
}
