import { Request, Response } from "express"
import { Post } from "../models/post.model"
import { AuthRequest } from "../middleware/auth"
import { resolve } from "path"
import cloudinary from "../config/cloudinary"

export const createPost = async (req: AuthRequest, res: Response) => {
  try {
    const { title, content, tags } = req.body
    let imageURL = ""
    if(req.file){
     const result: any = await  new Promise((resolve, reject) => {
            const upload_stream =  cloudinary.uploader.upload_stream(
                { folder: "posts" },
                (error, result) => {
                    if(error) return reject(error)
                        resolve(result)
                }
            )
            upload_stream.end(req.file?.buffer)
        })

        imageURL = result.secure_url
    }

    if (!title || !content) {
      return res.status(400).json({ message: "Title and content are required" })
    }

    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" })
    }

    const authorId = req.user.sub

    const newPost = await Post.create({
      title,
      content,
      tags: tags.split(","), // "mobile,smartphone" -> ["mobile" , "smartphone"]
      imageURL,
      author: req.user.sub  //userId 
    })

    res.status(201).json({
      message: "Post created successfully",
      data: newPost
    })
  } catch (err: any) {
    res.status(500).json({ message: err?.message })
  }
}