/* =======================================================
 *
 * Created by anele on 01/07/2026.
 *
 * @anele_ace
 *
 * =======================================================
 */

import { Outlet } from 'react-router-dom'

export async function loader() {
    return null
}

export default function Root() {
    return <Outlet />
}