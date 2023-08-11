'use client'

import { ProjectInterface, SessionInterface } from '@/common.types'
import React, { ChangeEvent, useState } from 'react'
import {useRouter} from 'next/navigation'
import Image from 'next/image'
import FormField from './FormField'
import { categoryFilters } from '@/constants'
import CustomMenu from './CustomMenu'
import Button from './Button'
import { createNewProject, fetchToken, updateProject } from '@/lib/actions'

type Props={
    type:string,
    session: SessionInterface,
    project?: ProjectInterface
}

const ProjectForm = ({type, session, project}:Props) => {

    const router = useRouter();

    const handleFormSubmit = async (e:React.FormEvent) =>{
        e.preventDefault()
        setIsSubmiting(true)
        const {token} = await fetchToken();
        try {
            if(type === 'create'){
                await createNewProject(form, session?.user?.id, token)
                router.push('/')
            }

            if(type === 'edit'){
                await updateProject(form, project?.id as string ,token)
                router.push('/')
            }
        } catch (error) {
            console.log(error)
        } finally {
            setIsSubmiting(false)
        }
    }
    
    const handleChangeImage = (e:ChangeEvent<HTMLInputElement>) =>{
        e.preventDefault();
        const file = e.target.files?.[0]
        if(!file) return
        if(!file.type.includes('image')){
            return alert("Please upload an image file!")
        }

        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload=()=>{
            const result = reader.result as string
            handleStateChange('image',result)
        }
    }

    const handleStateChange = (fieldName: string, value:string) =>{
        setForm((prevState)=>(
            {
                ...prevState,
                [fieldName]: value,
            }
        ))
    }
    
    const [form, setForm] = useState({
        title: project?.title ||'',
        image: project?.image ||'',
        description: project?.description ||'',
        liveSiteUrl: project?.liveSiteUrl ||'',
        githubUrl: project?.githubUrl ||'',
        category: project?.category ||'',
    })

    const [isSubmiting, setIsSubmiting] = useState(false)

  return (
    <form onSubmit={handleFormSubmit} className='flexStart form'>
        <div className='flexStart form_image-container'>
            <label htmlFor='poster' className='flexCenter form_image-label'>
                {!form.image && 'Choose a Poster for your project'}
            </label>
            <input
                id='image'
                type='file'
                accept='image/*'
                required={type === 'create'}
                className='form_image-input'
                onChange={handleChangeImage}
            />
            {form.image && (
                <Image
                    src={form?.image}
                    className="sm:p-10 object-contain z-20"
                    alt="Poster"
                    fill
                />
            )}
        </div>
        <FormField
            title="Title"
            state={form.title}
            placeholder="Flexibble"
            setState={(value)=> handleStateChange('title',value)}
        />
        <FormField
            title="Decription"
            state={form.description}
            placeholder="Showcase remarkable projects"
            setState={(value)=> handleStateChange('description',value)}
        />
        <FormField
            type='url'
            title="Website URL"
            state={form.liveSiteUrl}
            placeholder="https://xyz.com"
            setState={(value)=> handleStateChange('liveSiteUrl',value)}
        />
        <FormField
            type='url'
            title="Github URL"
            state={form.githubUrl}
            placeholder="https://github.com/prateekpheonix"
            setState={(value)=> handleStateChange('githubUrl',value)}
        />

        <CustomMenu
            title="Category"
            state={form.category}
            filters={categoryFilters}
            setState={(value)=> handleStateChange('category',value)}
        />
        
        <div className='flexStart w-full'>
            <Button
                title={isSubmiting 
                    ? `${type === 'create' ? 'Creating': 'Editing'}` : `${type === 'create' ? 'Create' : 'Edit'}`
                }
                type='submit'
                leftIcon={isSubmiting ? "" : "/plus.svg"}
                isSubmiting = {isSubmiting}
            />
        </div>
    </form>
  )
}

export default ProjectForm