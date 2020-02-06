import React from 'react';
// material-ui components
import withStyles from "@material-ui/core/styles/withStyles";
import Slide from "@material-ui/core/Slide";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import IconButton from "@material-ui/core/IconButton";
// @material-ui/icons
import Close from "@material-ui/icons/Close";
// core components
import Button from "components/CustomButtons/Button.jsx";

import modalStyle from "assets/jss/material-kit-react/modalStyle.jsx";

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="down" ref={ref} {...props} />;
});

const Modal = React.forwardRef((props, ref) => {
    const [modal, setModal] = React.useState(false);
    const { classes } = props;
    const toggleModal = (condition) => {
        setModal(condition);
    };
    React.useImperativeHandle(ref, () => {
        return {
            toggleModal: toggleModal
        }
    });
    return (
        <div>
            <Dialog
                classes={{
                    root: classes.center,
                    paper: classes.modal
                }}
                open={modal}
                TransitionComponent={Transition}
                keepMounted
                onClose={() => setModal(false)}
                aria-labelledby="modal-slide-title"
                aria-describedby="modal-slide-description"
            >
                <DialogTitle
                    id="classic-modal-slide-title"
                    disableTypography
                    className={classes.modalHeader}
                >
                    <IconButton
                        className={classes.modalCloseButton}
                        key="close"
                        aria-label="Close"
                        color="inherit"
                        onClick={() => setModal(false)}
                    >
                        <Close className={classes.modalClose} />
                    </IconButton>
                    <h4 className={classes.modalTitle}>{props.title}</h4>
                </DialogTitle>
                <DialogContent
                    id="modal-slide-description"
                    className={classes.modalBody}
                >
                    {props.description}
                </DialogContent>
                <DialogActions
                    className={classes.modalFooter + " " + classes.modalFooterCenter}
                >
                    <Button onClick={props.successButtonFunction} style={props.onlySuccessButton ? { display: 'flex' } : { display: 'none' }} color="success">
                        {props.successButtonText}
                    </Button>
                    <Button onClick={props.closeButtonFunction} style={props.onlyCloseButton ? { display: 'flex' } : { display: 'none' }}>
                        {props.closeButtonText}
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
});
export default withStyles(modalStyle)(Modal);