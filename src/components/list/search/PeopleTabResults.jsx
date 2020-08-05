import React from "react";
import { PeopleSearchItem } from "./index";

const PeopleTabResults = (props) => {

    const { page, people, redirect } = props;

    return (
        <ul className="list-group list-group-flush">
            {
                Object.keys(people).length > 0 && Object.values(people).slice(page > 1 ? (page*10)-10 : 0, page*10).map((p) => {
                    return <PeopleSearchItem key={p.id} user={p.data} redirect={redirect}/>
                })
            }
        </ul>
    );
};

export default PeopleTabResults;