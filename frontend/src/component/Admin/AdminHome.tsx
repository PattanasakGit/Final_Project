
import React, { useEffect, useState, } from 'react';
import '../../css/Background.css';
import '../../css/Admin_Home.css';

import { Image, Tag } from 'antd';
import { getUserByID, fetchCategories, fillter_product, getProductByID } from '../system/HTTP_Request ';
import moment from 'moment';
import { Card, CardContent, Grid, Typography } from '@mui/material';
import { useParams } from 'react-router-dom';
import Swal from 'sweetalert2' // Alert text --> npm install sweetalert2
import { bgcolor } from '@mui/system';


function AdminHome() {
    return (
        <center>
            <div style={{ height: '82vh', width: '90%', backgroundColor:'#ffffff99'}} className='contentPage'>
                <div className='container_admin_home'>

                    55555555555

                </div>
            </div>


        </center>

    );
}

export default AdminHome;
