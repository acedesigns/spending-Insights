/* eslint-disable react-refresh/only-export-components */
import type { ReactElement } from 'react'
import { render, type RenderOptions } from '@testing-library/react'
import { Provider } from '../theme/Provider'

function renderWithProviders(ui: ReactElement, options?: Omit<RenderOptions, 'wrapper'>) {
  return render(ui, { wrapper: Provider, ...options })
}

export * from '@testing-library/react'
export { renderWithProviders as render }
