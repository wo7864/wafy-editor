import axios from 'axios';

const SERVER_URL = "http://localhost:8080"
const API_URL = `${SERVER_URL}/api`
const PROJECTS_URL = `${SERVER_URL}/api/users/projects`

export const initData = async ({project_id}) => {
    const url = `${API_URL}/auth/user`;

    const user_res = await axios.get(
        url,
        { withCredentials: true }
    );

    const project_url = `${PROJECTS_URL}/${user_res.data.user.id}/${project_id}`;
    const project_res = await axios.get(
        project_url,
    )

    return {
        user:user_res.data.user,
        project: project_res.data,

    }

}
