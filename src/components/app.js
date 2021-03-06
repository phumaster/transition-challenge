import { h, Component } from 'preact';
import { Router } from 'preact-router';
import PreactAnimate from 'preact-animate';
import Header from './header';
import Home from '../routes/home';
import Details from '../routes/details';
import Profile from '../routes/profile';
import AppRouter from './app-router';

export default class App extends Component {
	constructor(){
		super();
		this.appRouter_;
		this.animateToDetails = this.animateToDetails.bind(this);
		this.animateToHome = this.animateToHome.bind(this);
		this.removeGhost = this.removeGhost.bind(this);
		this.getPrevUrlIndex = this.getPrevUrlIndex.bind(this);
	}
	/** Gets fired when the route changes.
	 *	@param {Object} event		"change" event from [preact-router](http://git.io/preact-router)
	 *	@param {string} event.url	The newly routed URL
	 */
	handleRoute = e => {
		this.appRouter_ && this.appRouter_.setRoute(e.url);
	};

	animateToDetails(card) {
		document.body.classList.add('lock');
		this.animGhost.appendChild(card);
	}

	animateToHome(card) {
		window.scrollTo(0,0);
		document.body.classList.remove('lock');
		this.animGhost.appendChild(card);
	}

	removeGhost() {
		this.animGhost.innerHTML = '';
	}

	getPrevUrlIndex() {
		if (!this.prevUrl) {
			return -1;
		}
		return Number(this.prevUrl.substring(this.prevUrl.lastIndexOf('/') + 1));
	}

	componentDidMount() {
		this.appRouter_ = new AppRouter(this.animGhost, this.header);
	}

	render() {
		return (
			<div id="app" className={`${this.state.prevUrl===null?'firstview':''}`}>
				<Header ref={header => this.header= header} />
				<TransitionRouter onChange={this.handleRoute} >
					<Home key="1" path="/" getRouter={() => this.appRouter_} />
					<Details key="2" getRouter={() => this.appRouter_} path="/details/:cardindex" />
					<Profile key="3" getRouter={() => this.appRouter_} path="/profile/:id" />
				</TransitionRouter>
				<div ref={animGhost => this.animGhost = animGhost} className="animation-ghost" />
			</div>
		);
	}
}

class TransitionRouter extends Router {

	callWillLeave = (child) => {
		child._component._component.componentWillLeave &&
						child._component._component.componentWillLeave();
	}

	render(props, state) {
		return (
			<PreactAnimate
				component="div"
				transitionName="pageTransition"
				transitionEnter={false}
				transitionLeave
				transitionLeaveTimeout={500}
				onBeforeLeave={this.callWillLeave}
			>
				{super.render(props, state)}
			</PreactAnimate>
		);
	}
}