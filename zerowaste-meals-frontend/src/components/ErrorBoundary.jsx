import { Component } from 'react'

export class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error, info) {
    console.error('ZeroWaste Meals crashed:', error, info)
  }

  handleReload = () => {
    window.location.reload()
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-6 text-center">
          <p className="font-display text-6xl font-extrabold text-brand-600">Oops!</p>
          <h1 className="mt-4 font-display text-2xl font-bold text-gray-900">
            Something went wrong
          </h1>
          <p className="mt-2 max-w-md text-sm text-gray-500">
            An unexpected error occurred while rendering this page. Try reloading — if it
            keeps happening, the server may still be starting up.
          </p>
          <button
            type="button"
            onClick={this.handleReload}
            className="mt-6 rounded-xl bg-brand-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-brand-700"
          >
            Reload page
          </button>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary