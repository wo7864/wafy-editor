import React from 'react';
import { useAsync } from 'react-async';
import {
	BrowserRouter as Router,
	Route,
	useParams
} from "react-router-dom";
import { observer } from 'mobx-react';

import { useStores } from './states/Context';

import {initData} from './api'

import Header from './Component/Header';
import Tool from './Component/Tool';
import Stage from './Component/Stage';
import Controller from './Component/Controller';
import AnimationComponent from './Component/AnimationComponent';

import './static/css/App.css';

const Contents = observer(() => {

	const { windowStore, userStore } = useStores();
	const { project_id } = useParams();

	// const { data, error, isLoading } = useAsync({
	// 	promiseFn: initData,
	// 	project_id:project_id
	// });
	// if (isLoading) return <Loading />;
	// if (error) return <div>에러가 발생했습니다</div>;
	// if (!data) return <></>;
	

	// userStore.setUserData(data.user)

	return (
		<div className="container">
			<Header />
			<div className="body-container">
				<Tool />
				<Stage />
				<Controller />
			</div>
			{windowStore.animationComponent && <AnimationComponent />}
		</div>
	)
})

const Loading = () => {
	return (
		<div>로딩중</div>
	)
}

const App = () => {



	//<Route path="/:project_id">

	return (
		<Router>
			<Route path="/">
				<Contents />
			</Route>
		</Router>
	);
}



export default App;
