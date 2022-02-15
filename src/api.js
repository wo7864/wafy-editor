import axios from 'axios';
import {
    API_URL,
    PROJECTS_URL,
    ASSETS_URL,
} from './util/constant'


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
        user: user_res.data.user,
        project: project_res.data,

    }

}


export const saveProject = async (id, project_id, data) => {
    const url = `${PROJECTS_URL}/save/${id}/${project_id}`;
    return await axios.patch(
        url,
        { data: data },
        { withCredentials: true }
    );
}

export const addAssetImage = async (id, project_id, form) => {
    const url = `${ASSETS_URL}/images/${id}/${project_id}`;

    return await axios.post(
        url,
        form,
        {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        }
    )
}

export const addAssetVideo = async (id, project_id, form) => {
    const url = `${ASSETS_URL}/videos/${id}/${project_id}`;

    return await axios.post(
        url,
        form,
        {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        }
    )
}

export const splitVideo = async (id, project_id, filename) => {
    const url = `${ASSETS_URL}/videos/split/${id}/${project_id}/${filename}`;

    const res = await axios.get(url)
    .catch(e => {
        console.error(e)
    })
    return res;
}