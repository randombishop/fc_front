import { useState } from 'react';
import { Button, Menu, MenuItem } from '@mui/material';


const HeaderMenuCarto = (props:any) => {
    const networkUrl = '#/carto/network/random/10/group/1';
    const clustersUrl = '#/carto/clusters';
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);

    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <div>
            <Button color={props.color} onClick={handleClick}>Cartography</Button>
            <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
            >
                <MenuItem component="a" href={networkUrl} onClick={handleClose}>Networks</MenuItem>
                <MenuItem component="a" href={clustersUrl} onClick={handleClose}>Clusters</MenuItem>
            </Menu>
        </div>
    );
};


export default HeaderMenuCarto ;
