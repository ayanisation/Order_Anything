import {
  AppBar,
  Button,
  Container,
  Fade,
  Grow,
  IconButton,
  InputAdornment,
  LinearProgress,
  makeStyles,
  Menu,
  MenuItem,
  Paper,
  TextField,
  Typography,
} from "@material-ui/core";
import { useForm } from "react-hook-form";
import Forms from "../../Jsons/Forms";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useHistory } from "react-router-dom";
import { useState } from "react";
import VisibilityIcon from "@material-ui/icons/Visibility";
import VisibilityOffIcon from "@material-ui/icons/VisibilityOff";
import { useDispatch } from "react-redux";
import { signup } from "../../Actions/usersAction";

const useStyles = makeStyles((theme) => ({
  root: {
    "& .MuiTextField-root": {
      margin: theme.spacing(1),
    },
  },
  appBar: {
    display: "flex",
    padding: 10,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "black",
  },
  heading: {
    color: "#C2936E",
    fontWeight: "bold",
  },
  paper: {
    padding: theme.spacing(5),
    background: "white",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  textField: {
    marginBottom: 8,
  },
  buttonSubmit: {
    fontWeight: "bold",
    marginTop: 10,
    marginBottom: 10,
    background: "#79CDCD",
    fontFamily: "Copperplate Papyrus",
  },
  buttonCancel: {
    fontWeight: "bold",
    fontFamily: "Copperplate Papyrus",
    marginTop: 10,
    marginBottom: 10,
    background: "#ed1c24",
    color: "white",
  },
  buttons: {
    display: "flex",
    justifyContent: "space-around",
  },
}));

let schema = yup.object().shape({
  name: yup.string().required("Please enter your name"),
  phone: yup
    .string("Invalid no.")
    .required("Please enter your phone no.")
    .min(10, "Invalid no.")
    .max(10, "invalid no."),
  password: yup
    .string()
    .required("Please create a password ")
    .min(8, "Password should be atleast 8 digits long"),
  confPass: yup
    .string()
    .required("Please confirm password ")
    .min(8, "Password should be atleast 8 digits long"),
});

export default function Signup() {
  const classes = useStyles();
  const history = useHistory();
  const dispatch = useDispatch();

  const [message, setMessage] = useState("");
  const [issue, setIssue] = useState(false);
  const [load, setLoad] = useState(false);
  const [visible, setVisible] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const [anchorEl, setAnchorEl] = useState(null);
  const [type, setType] = useState("Select");
  const [selected, setSelected] = useState(true);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const submit = async (formData) => {
    if (type === "Select") {
      setSelected(false);
      return;
    }
    if (formData.password !== formData.confPass) {
      window.alert("Passwords do not match");
      return;
    }
    formData.userType = type;
    console.log(formData);
    setLoad(true);
    try {
      const response = await dispatch(signup(formData));
      if (response !== "Success") {
        setLoad(false);
        setMessage("Phone no. is taken. Try another");
        setIssue(true);
        setTimeout(() => {
          setIssue(false);
        }, 3000);
      } else {
        history.push("/upload");
      }
    } catch (error) {
      console.log(error);
      setLoad(false);
      setMessage("Unable to register (Internal server error)");
      setIssue(true);
      setTimeout(() => {
        setIssue(false);
      }, 3000);
    }
    setLoad(false);
  };
  return (
    <>
      <Container maxWidth="lg" style={{ height: 30 }}>
        <AppBar className={classes.appBar} position="fixed" color="inherit">
          <Typography className={classes.heading} variant="h4" align="center">
            Order Anything
          </Typography>
        </AppBar>
      </Container>
      <Grow in>
        <Container maxWidth="sm" style={{ marginTop: 20, marginBottom: 60 }}>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              marginBottom: 10,
              padding: 20,
            }}
          >
            <Fade in={issue}>
              <Paper style={{ padding: 10, background: "#ba160c" }}>
                <Typography style={{ color: "white" }} variant="h6">
                  {message}
                </Typography>
              </Paper>
            </Fade>
          </div>
          <Paper className={classes.paper}>
            <form autoComplete="off" className={classes.form} noValidate>
              <Typography
                style={{ textAlign: "center", marginBottom: 20 }}
                variant="h4"
              >
                Create an account
              </Typography>
              {Forms.map((form) => (
                <div key={form.name} className={classes.textField}>
                  <TextField
                    {...register(form.name)}
                    name={form.name}
                    type={
                      form.name === "password"
                        ? visible
                          ? "text"
                          : "password"
                        : form.type
                    }
                    variant="outlined"
                    label={form.label}
                    fullWidth
                    InputProps={{
                      endAdornment:
                        form.name === "password" ? (
                          <InputAdornment position="end">
                            <IconButton
                              onClick={() => {
                                setVisible((preVisible) => !preVisible);
                              }}
                            >
                              {visible ? (
                                <VisibilityIcon />
                              ) : (
                                <VisibilityOffIcon />
                              )}
                            </IconButton>
                          </InputAdornment>
                        ) : (
                          <></>
                        ),
                    }}
                  ></TextField>
                  {errors[form.name] ? (
                    <p style={{ color: "#b22222", marginTop: -3 }}>
                      {errors[form.name].message}
                    </p>
                  ) : (
                    <></>
                  )}
                  {form.name === "phone" ? (
                    <>
                      <div style={{ display: "flex", marginTop: 10 }}>
                        <Typography variant="h6">Signup as :</Typography>
                        <Button
                          style={{ marginLeft: 20, border: "1px solid" }}
                          aria-controls="simple-menu"
                          aria-haspopup="true"
                          onClick={handleClick}
                        >
                          {type}
                        </Button>
                        <Menu
                          id="simple-menu"
                          anchorEl={anchorEl}
                          keepMounted
                          open={Boolean(anchorEl)}
                          onClose={handleClose}
                        >
                          <MenuItem
                            onClick={() => {
                              setType("Customer");
                              setAnchorEl(null);
                              setSelected(true);
                            }}
                          >
                            Customer
                          </MenuItem>
                          <MenuItem
                            onClick={() => {
                              setType("Delivery");
                              setAnchorEl(null);
                              setSelected(true);
                            }}
                          >
                            Delivery
                          </MenuItem>
                        </Menu>
                      </div>
                      {!selected ? (
                        <p style={{ color: "#b22222", marginTop: -3 }}>
                          {"Please select a user type"}
                        </p>
                      ) : (
                        <></>
                      )}
                    </>
                  ) : (
                    <></>
                  )}
                </div>
              ))}
              <div className={classes.buttons}>
                <Button
                  className={classes.buttonSubmit}
                  onClick={handleSubmit(submit)}
                >
                  Submit
                </Button>
                <Button
                  onClick={() => {
                    history.push("/");
                  }}
                  className={classes.buttonCancel}
                >
                  Cancel
                </Button>
              </div>
              {load && <LinearProgress />}
            </form>
          </Paper>
        </Container>
      </Grow>
    </>
  );
}
