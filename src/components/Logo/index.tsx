import React from 'react';
import { Avatar, Box, ImageListItem } from '@mui/material';
import { Link } from 'react-router-dom';
import { styled } from '@mui/material/styles';

const LogoWrapper = styled(Link)(
	({ theme }) => `
	color: ${theme.palette.text.primary};
	padding: ${theme.spacing(0, 1, 1, 0)};
	display: flex;
	justify-content: center;
	align-items: center;
	text-decoration: none;
	width: 100%;
	font-weight: ${theme.typography.fontWeightBold};
`
);

const LogoSignWrapper = styled(Box)(
	() => `
	width: 52px;
	height: 38px;
	margin-top: 4px;
	transform: scale(.8);
`
);

const LogoSign = styled(Box)(
	({ theme }) => `
	background: ${theme.general.reactFrameworkColor};
	width: 18px;
	height: 18px;
	border-radius: ${theme.general.borderRadiusSm};
	position: relative;
	transform: rotate(45deg);
	top: 3px;
	left: 17px;

	&:after, 
	&:before {
	    content: "";
	    display: block;
	    width: 18px;
	    height: 18px;
	    position: absolute;
	    top: -1px;
	    right: -20px;
	    transform: rotate(0deg);
	    border-radius: ${theme.general.borderRadiusSm};
	}

	&:before {
	    background: ${theme.palette.primary.main};
	    right: auto;
	    left: 0;
	    top: 20px;
	}

	&:after {
	    background: ${theme.palette.secondary.main};
	}
`
);

const LogoSignInner = styled(Box)(
	({ theme }) => `
	width: 16px;
	height: 16px;
	position: absolute;
	top: 12px;
	left: 12px;
	z-index: 5;
	border-radius: ${theme.general.borderRadiusSm};
	background: ${theme.header.background};
`
);

const Logo = () => {
	// return (
	// 	<LogoWrapper to="/dashboard">
	// 		<LogoSignWrapper>
	// 			<LogoSign>
	// 				<LogoSignInner />
	// 			</LogoSign>
	// 		</LogoSignWrapper>
	// 	</LogoWrapper>
	// );
	return (
		<LogoWrapper to="/">
			<img alt="yugo_logo" src="/static/images/logo/yugo-logo.png" height="80px" width="auto" />
		</LogoWrapper>
	);
};

export default Logo;
