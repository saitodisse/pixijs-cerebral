/* globals requestAnimationFrame */

import React, {Component, PropTypes} from 'react'
import {connect} from 'cerebral/react'
// noinspection JSFileReferences
import * as PIXI from 'pixi.js'
import './styles.css'
import * as util from './util'

export default connect({
  rotationSpeed: 'sunRotationModule.rotationSpeed'
},
  class Canvas extends Component {
    /**
     * Define our prop types
     **/
    static get propTypes () {
      return {
        zoomLevel: PropTypes.number.isRequired
      }
    }

    constructor (props) {
      super(props)

      // bind our animate function
      this.animate = this.animate.bind(this)
      // bind our zoom function
      this.updateZoomLevel = this.updateZoomLevel.bind(this)
      this.isPlaying = false
    }

    /**
     * In this case, componentDidMount is used to grab the canvas container ref, and
     * and hook up the PixiJS renderer
     **/
    componentDidMount () {
      const clientSize = {
        width: Math.max(document.documentElement.clientWidth, window.innerWidth || 0),
        height: Math.max(document.documentElement.clientHeight, window.innerHeight || 0)
      }

      // get input[range] position
      let position = util.getPosition(document.querySelector('input[type="range"]'))
      let yBottonInputRange = position.y + 23

      const MARGIN = 20
      const canvasSize = {
        width: clientSize.width - MARGIN * 2,
        height: (clientSize.height - yBottonInputRange) - MARGIN * 2
      }

      this.renderer = PIXI.autoDetectRenderer(canvasSize.width, canvasSize.height, {
        backgroundColor: 0xcccccc
      })
      this.refs.gameCanvas.appendChild(this.renderer.view)

      // create the root of the scene graph
      this.stage = new PIXI.Container()

      this.props.onStart({
        ctx: this,
        PIXI,
        canvasSize
      })

      // start animating
      this.isPlaying = true
      this.animate()
    }

    componentWillUnmount () {
      this.isPlaying = false
    }

    /**
     * shouldComponentUpdate is used to check our new props against the current
     * and only update if needed
     **/
    shouldComponentUpdate (nextProps, nextState) {
      // this is easy with 1 prop, using Immutable helpers make
      // this easier to scale

      return nextProps.zoomLevel !== this.props.zoomLevel
    }

    /**
     * When we get new props, run the appropriate imperative functions
     **/
    componentWillReceiveProps (nextProps) {
      this.updateZoomLevel(nextProps)
    }

    /**
     * Update the stage "zoom" level by setting the scale
     **/
    updateZoomLevel (props) {
      this.stage.scale.x = props.zoomLevel
      this.stage.scale.y = props.zoomLevel
    }

    /**
     * Animation loop for updating Pixi Canvas
     **/
    animate () {
      if (this.isPlaying === false) {
        return
      }

      this.props.onAnimate(this)

      // render the stage container
      this.renderer.render(this.stage)
      this.frame = requestAnimationFrame(this.animate)
    }

    /**
     * Render our container that will store our PixiJS game canvas. Store the ref
     **/
    render () {
      return (
        <div id='canvas-container' ref='gameCanvas' />
      )
    }
  }
)

