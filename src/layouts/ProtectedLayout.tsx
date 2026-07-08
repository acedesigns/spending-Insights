/* =======================================================
 *
 * Created by anele on 02/07/2026.
 *
 * @anele_ace
 *
 * =======================================================
 */

import { Outlet, redirect } from 'react-router-dom'

/** Pathless layout for authenticated routes (dashboard, etc.).
 *  Redirects unauthenticated users to login. */
export async function loader() {
    // TODO: replace with real session/token check
    const user = {'email': 'test@gmail.com'}
    if (!user) return redirect('/login')
    return null
}

export default function ProtectedLayout() {
    return <Outlet />
}
