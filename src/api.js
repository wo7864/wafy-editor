import axios from 'axios';

export const SERVER_URL = "http://localhost:8080"
export const API_URL = `${SERVER_URL}/api`
export const PROJECTS_URL = `${SERVER_URL}/api/users/projects`
export const ASSETS_IMAGE_URL = `${SERVER_URL}/assets/images/`;
export const ASSETS_VIDEO_URL = `${SERVER_URL}/assets/videos/`;

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
