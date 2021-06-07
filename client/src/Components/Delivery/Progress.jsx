import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Stepper from "@material-ui/core/Stepper";
import Step from "@material-ui/core/Step";
import StepLabel from "@material-ui/core/StepLabel";
import Button from "@material-ui/core/Button";
import { LinearProgress } from "@material-ui/core";
import { useDispatch } from "react-redux";
import { updateOrder } from "../../Actions/ordersAction";
import { updateUser } from "../../Actions/usersAction";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
  },
  button: {
    marginRight: theme.spacing(1),
  },
}));

function getSteps() {
  return ["Reached Store", "Items Picked", "Enroute", "Delivered"];
}

export default function Progress({ active, user, socket }) {
  const classes = useStyles();
  const dispatch = useDispatch();

  const steps = getSteps();
  const current = steps.findIndex((step) => step === active.status) + 1;
  const [activeStep, setActiveStep] = useState(current);

  const handleNext = async () => {
    const status = steps[activeStep];
    console.log(status);
    active.status = status;
    try {
      await dispatch(updateOrder(active));
      if (status === "Delivered") {
        user.available = true;
        await dispatch(updateUser(user));
      }
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
      socket.emit("update");
    } catch (e) {
      window.alert("Something went wrong");
    }
  };

  return (
    <div className={classes.root}>
      <Stepper activeStep={activeStep} alternativeLabel>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
      <div>
        {activeStep === steps.length ? (
          <div style={{ marginTop: 20 }}>
            <LinearProgress />
          </div>
        ) : (
          <div
            style={{ marginTop: 20, display: "flex", justifyContent: "center" }}
          >
            <Button
              variant="contained"
              color="primary"
              onClick={handleNext}
              className={classes.button}
            >
              {activeStep === steps.length - 1 ? "Finish" : "Next"}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
