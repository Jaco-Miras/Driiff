import React from "react";
import { PeopleSearchItem } from "./index";

const PeopleTabResults = (props) => {

    const { page, people } = props;

    return (
        <ul className="list-group list-group-flush">
            {
                Object.values(people).slice(page > 1 ? (page*10)-10 : 0, page*10).map((p) => {
                    return <PeopleSearchItem key={p.id} user={p.data}/>
                })
            }
        </ul>
    );
};

export default PeopleTabResults;