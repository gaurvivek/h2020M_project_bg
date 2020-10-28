import React from 'react'
import Grid from '@material-ui/core/Grid';
import Switch from '@material-ui/core/Switch';
import { withStyles } from '@material-ui/core/styles';
const AntSwitch = withStyles((theme) => ({
    root: {
        width: 38,
        height: 16,
        padding: 0,
        display: 'flex',
    },
    switchBase: {
        padding: 2,
        color: theme.palette.grey[500],
        '&$checked': {
            transform: 'translateX(22px)',
            color: theme.palette.common.white,
            '& + $track': {
                opacity: 1,
                backgroundColor: '#01A7A6',
                borderColor: '#01A7A6',
            },
        },
    },
    thumb: {
        width: 12,
        height: 12,
        boxShadow: 'none',
    },
    track: {
        border: `1px solid ${theme.palette.grey[500]}`,
        borderRadius: 16 / 2,
        opacity: 1,
        backgroundColor: theme.palette.common.white,
    },
    checked: {},
}))(Switch);
function SwitchToggle(props) {
    const {id, status, clickHandler} = props;
    return (
        <div>
            <Grid component="label" container alignItems="center" spacing={1}>
                <Grid item>
                    <AntSwitch 
                        key={id}
                        checked={status}
                        name='checkc'
                        onClick={clickHandler}
                    />
                </Grid>
            </Grid>
        </div>
    )
}

export default SwitchToggle