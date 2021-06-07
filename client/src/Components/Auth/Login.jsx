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
  Paper,
  TextField,
  Typography,
} from "@material-ui/core";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Link, useHistory, useParams } from "react-router-dom";
import { useState } from "react";
import VisibilityIcon from "@material-ui/icons/Visibility";
import VisibilityOffIcon from "@material-ui/icons/VisibilityOff";
import { useDispatch } from "react-redux";
import { login } from "../../Actions/usersAction";

const useStyles = makeStyles((theme) => ({
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
  root: {
    "& .MuiTextField-root": {
      margin: theme.spacing(1),
    },
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
    marginBottom: 20,
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
  },
  buttons: {
    marginTop: 30,
    display: "flex",
    justifyContent: "space-around",
  },
}));

let schema = yup.object().shape({
  phone: yup
    .string()
    .required("Please enter phone no.")
    .min(10, "Invalid phone no.")
    .max(10, "Invalid phone no."),
  password: yup.string().required("Please enter password"),
});

export default function Login() {
  const classes = useStyles();
  const history = useHistory();
  const dispatch = useDispatch();
  const [message, setMessage] = useState("");
  const [issue, setIssue] = useState(false);
  const [load, setLoad] = useState(false);
  const [visible, setVisible] = useState(false);

  const { type } = useParams();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const submit = async (formData) => {
    formData.userType = type;
    setLoad(true);
    try {
      const response = await dispatch(login(formData));
      if (response !== "Success") {
        setLoad(false);
        setMessage("Invalid login credentials");
        setIssue(true);
        setTimeout(() => {
          setIssue(false);
        }, 3000);
      } else {
        if (type === "Customer") history.push("/items");
        else if (type === "Admin") history.push("/admin");
        else history.push("/active");
      }
    } catch (error) {
      console.log(error);
      setLoad(false);
      setMessage("Unable to login (internal server error)");
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
        <Container maxWidth="sm" style={{ marginTop: 40, marginBottom: 60 }}>
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
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  marginBottom: 40,
                }}
              >
                <Typography variant="h4">Login</Typography>
              </div>
              <div className={classes.textField}>
                <TextField
                  {...register("phone")}
                  name="phone"
                  type="text"
                  variant="outlined"
                  autoComplete="on"
                  label="Phone"
                  fullWidth
                ></TextField>
                {errors.phone ? (
                  <p style={{ color: "#b22222", marginTop: -3 }}>
                    {errors.phone.message}
                  </p>
                ) : (
                  <></>
                )}
              </div>
              <div className={classes.textField}>
                <TextField
                  {...register("password")}
                  name="password"
                  type={visible ? "text" : "password"}
                  variant="outlined"
                  label="Password"
                  fullWidth
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => {
                            setVisible((preVisible) => !preVisible);
                          }}
                        >
                          {visible ? <VisibilityIcon /> : <VisibilityOffIcon />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                ></TextField>
                {errors.password ? (
                  <p style={{ color: "#b22222", marginTop: -3 }}>
                    {errors.password.message}
                  </p>
                ) : (
                  <></>
                )}
              </div>
              <div className={classes.buttons}>
                <Button
                  className={classes.buttonSubmit}
                  onClick={handleSubmit(submit)}
                >
                  Submit
                </Button>
              </div>
            </form>
            <div className={classes.buttons}>
              <Typography
                component={Link}
                to="/signup"
                style={{ textDecoration: "none", marginTop: 10 }}
                variant="body2"
              >
                New User ? Click here to register
              </Typography>
            </div>
            {load && <LinearProgress />}
          </Paper>
        </Container>
      </Grow>
    </>
  );
}
