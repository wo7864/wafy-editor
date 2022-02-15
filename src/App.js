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
import { IS_ONLINE } from './util/constant';

const Main = observer(() => {
	const { 
		windowStore, 
		userStore, 
		elementStore,
		assetStore
	} = useStores();

	if(IS_ONLINE){
		const { project_id } = useParams();

		const { data, error, isLoading } = useAsync({
			promiseFn: initData,
			project_id:project_id
		});
		if (isLoading) return <Loading />;
		if (error) return <div>에러가 발생했습니다</div>;
		if (!data) return <></>;

		userStore.setUserData({
			...data.user,
			project_id:project_id
		})
		elementStore.load(data.project.data)
		
		const assets = data.project.assets
		assetStore.initImages()
		assetStore.initVideos()
		assets.images.forEach(image => assetStore.addImage(image))
		assets.videos.forEach(video => assetStore.addVideo(video))
	}
	
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

	if(IS_ONLINE){
		return (
			<Router>
				<Route path="/">
					<Main />
				</Route>
			</Router>
		);
	}else{
		return <Main/>
	}

}



export default App;
