import { faGithub } from "@fortawesome/free-brands-svg-icons";
import { faMoon } from "@fortawesome/free-regular-svg-icons";
import { faInfo, faSun, faSync } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { Nav, Navbar, OverlayTrigger, Popover, Tooltip } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import {
  changeAppState,
  fetchContestList,
  fetchProblemList,
  fetchSharedProblemList,
} from "../data/actions/fetchActions";
import { AppReducerType } from "../data/actions/types";
import { fetchUserSubmissions, fetchUsers } from "../data/actions/userActions";
import { RootStateType } from "../data/store";
import { Path } from "../util/constants";
import { ThemesType } from "../util/Theme";
import "react-toastify/dist/ReactToastify.css";


const Menu = (): JSX.Element => {
  const dispatch = useDispatch();

  const state: RootStateType = useSelector((state) => state) as RootStateType;

  const [handle, setHandle] = useState(
    state.userList.handles.length ? state.userList.handles.toString() : ""
  );
  console.log(state.userList.handles.toString());
  useEffect(() => {
    fetchProblemList(dispatch);
    fetchContestList(dispatch);
    fetchSharedProblemList(dispatch);
  }, []);

  const InvokeErrorToast = (message: string) => {
    if (message.length === 0) {
      return;
    }
    console.log(message);
    toast.error(message, {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "dark",
    });
  };

  useEffect(() => {
    InvokeErrorToast(state.userSubmissions.error);
  }, [state.userSubmissions.error]);

  useEffect(() => {
    InvokeErrorToast(state.problemList.error);
  }, [state.problemList.error]);

  // useEffect(() => {
  //   if (!state.contestList.loading && !state.problemList.loading) sync(true);
  // }, [state.userList]);

  useEffect(() => {
    if (!state.contestList.loading && !state.problemList.loading)
      sync(state.userList.handles.length > 2 ? true : false);
    // console.log(state.contestList.loading);
    // console.log(state.problemList.loading);
  }, [state.userList, state.contestList.loading, state.problemList.loading]);

  const sync = (wait = false) => {
    fetchUserSubmissions(dispatch, state.userList.handles, wait);
  };

  const submitUser = () => {
    toast(`Handles entered: ${handle}`, {
      position: "bottom-right",
      autoClose: 500,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "dark",
    });
    fetchUsers(dispatch, handle);
  };

  return (
    <Navbar
      className={
        "navbar navbar-expand-lg navbar-light bg-white shadow p-2 ps-4 pe-4 " +
        state.appState.theme.navbar
      }
      expand="md"
      style={{ width: "100%" }}
    >
      <div className="container-fluid">
        <Link to="/" className="navbar-brand">
          <img src="https://avatars.githubusercontent.com/u/86391602?s=200&v=4" alt="bz-logo" style={{
            width: '30px',
            height: '30px',
            marginRight: '10px',
            borderRadius: '20%'
          
          }}/>
          <span style={{ color: state.appState.themeMod === ThemesType.DARK ? 'white' : 'black', marginRight: '50%' }}>Super Coders</span>
        </Link>
        <Navbar.Toggle aria-controls="basic-navbar-nav" className={state.appState.themeMod === ThemesType.DARK ? 'navbar-dark' : 'navbar-light'} style={{ borderColor: state.appState.themeMod === ThemesType.DARK ? 'white' : 'black' }} />

        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto ms-auto mt-2 mt-lg-0 justify-content-center"> {/* Changed ms-auto to me-auto and added justify-content-center */}
            <li className="nav-item active">
              <Link to={Path.Issues} className="nav-link">
                <span style={{ color: state.appState.themeMod === ThemesType.DARK ? 'white' : 'black' }}>Issues</span>
              </Link>
            </li>
            <li className="nav-item active">
              <Link to={Path.PROBLEMS} className="nav-link">
                <span style={{ color: state.appState.themeMod === ThemesType.DARK ? 'white' : 'black' }}>Practice</span>
              </Link>
            </li>
            <li className="nav-item">
              <Link to={Path.CONTESTS} className="nav-link">
                <span style={{ color: state.appState.themeMod === ThemesType.DARK ? 'white' : 'black' }}>Contests</span>
              </Link>
            </li>
            <li className="nav-item">
              <Link to={Path.Weekly} className="nav-link">
                <span style={{ color: state.appState.themeMod === ThemesType.DARK ? 'white' : 'black' }}>Weekly Questions</span>
              </Link>
            </li>
          </Nav>
          <Nav className="ms-auto mt-2 mt-lg-0"> {/* New Nav for last three items */}
            <li className="nav-item">
              <a
                className="nav-link"
                onClick={(e) => {
                  e.preventDefault();
                  if (state.appState.themeMod === ThemesType.DARK)
                    changeAppState(
                      dispatch,
                      AppReducerType.CHANGE_THEME,
                      ThemesType.LIGHT
                    );
                  else
                    changeAppState(
                      dispatch,
                      AppReducerType.CHANGE_THEME,
                      ThemesType.DARK
                    );
                }}
              >
                <FontAwesomeIcon
                  icon={state.appState.themeMod === ThemesType.DARK ? faMoon : faSun}
                  style={{ color: 'grey' }}
                />
              </a>
            </li>
            <li className="nav-item">
              <a
                className="nav-link"
                onClick={(e) => {
                  e.preventDefault();
                  sync();
                }}
                title="Refresh Submissions"
                href="#"
              >
                <FontAwesomeIcon icon={faSync} style={{ color: 'grey' }} />
              </a>
            </li>
            <li className="nav-item">
              <form
                className="form-inline d-flex my-2 my-lg-0 nav-item"
                onSubmit={(e) => {
                  e.preventDefault();
                  submitUser();
                }}
              >
                <input
                  name="handle"
                  className={"form-control " + state.appState.theme.bgText}
                  type="text"
                  placeholder="Enter handle"
                  aria-label="handles"
                  value={handle}
                  onChange={(e) => setHandle(e.target.value)}
                />
              </form>
            </li>
          </Nav>
        </Navbar.Collapse>
      </div>
      <ToastContainer />
    </Navbar>
  );
};

export default Menu;